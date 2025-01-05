const ProjectValidator = require("./ProjectValidator");
const ProjectRepository = require("./ProjectRepository");
const CategoryService = require("../Category/CategoryService");
const CharityRepository = require("../Charity/CharityRepository");
const RegionService = require("../Region/RegionService");
const { publish } = require("../../broker/Producer");
const axios = require("axios");

async function validateCharity(charityId) {
  const charityResponse = await axios.get(`http://172.30.208.1:3000/api/charities/${charityId}`);
  if (!charityResponse.data) {
    throw new Error("No Charity Found");
  }
  return charityResponse.data;
}

async function validateUser(userId) {
  const userResponse = await axios.get(`http://172.30.208.1:3000/api/users/${userId}`);
  if (!userResponse.data) {
    throw new Error("No Email Found");
  }
  return userResponse.data;
}

async function validateCategory(categoryIds) {
  const categories = [];

  for (const categoryId of categoryIds) {
    const category = await CategoryService.getCategoryById(categoryId);
    if (!category) {
      throw new Error("Error validating category ID");
    }
    categories.push(category);
  }
  return categories;
}


async function validateRegion(regionId) {
  const region = await RegionService.getRegionById(regionId);
  if (!region) {
    throw new Error("Error validating region ID");
  }
  return region;
}

function mergeNotificationLists(region, categories) {
  const result = new Set();

  categories.forEach(category => {
    category.notificationList.forEach(item => result.add(item));
  });

  region.notificationList.forEach(item => result.add(item));

  return result;
}

class ProjectService {
  async create(projectData) {
    ProjectValidator.validateProjectCreationRequest(projectData);
  
    const charity = await validateCharity(projectData.charityId);
    const user = await validateUser(charity.userId);
    
    const categories = await validateCategory(projectData.categoryIds);
    const categoryIds = categories.map(category => category._id);

    const region = await validateRegion(projectData.regionId);
  
    projectData = {
      charityId: projectData.charityId,
      categoryIds, 
      regionId: region._id, 
      title: projectData.title,
      goalAmount: projectData.goalAmount,
      startDate: projectData.startDate,
      endDate: projectData.endDate,
      hashedStripeId: charity.hashedStripeId,
    };
  
    console.log(projectData);
  
    const project = await ProjectRepository.create(projectData);
  
    const projectDTO = {...project, region: region, categories: categories[0]};

    const mergedNotificationList = mergeNotificationLists(region, categories);
  
    await publish({
      topic: "to_email",
      event: "create_project",
      message: {
        charity: { name: charity.name, email: user.email },
        project: projectDTO,
        notificationList: [...mergedNotificationList],
      },
    });
  
    return project;
  }
  

  async update(id, projectData) {
    ProjectValidator.validateProjectUpdateRequest(id, projectData);

    if (projectData.charityId) {
      await validateCharity(projectData.charityId);
    }
    if (projectData.categoryId) {
      await validateCategory(projectData.categoryId);
    }
    if (projectData.regionId) {
      await validateRegion(projectData.regionId);
    }

    return await ProjectRepository.update(id, projectData);
  }

  async delete(id) {
    const project = await ProjectRepository.getById(id);
    if (!project || project.status !== "halted") return false;

    const result = await ProjectRepository.delete(id);
    if (result) {
      await publish({
        topic: "to_shard",
        event: "deleted_project",
        message: project,
      });
    }
    return result;
  }

  async updateStatus(id, status, reason) {
    const project = await ProjectRepository.getById(id);
    if (!project) return false;

    if (
      (project.status === "active" && status === "halted") ||
      (project.status === "halted" && status === "active")
    ) {
      if (status === "halted") {
        // const charityId = await ProjectRepository.getCharityId(id);
        const charity = await validateCharity(reason);
        const user = await validateUser(charity.userId);

        const categoryIds = project.categoryIds.map(category => category._id);
        console.log(categoryIds);
        const categories = await validateCategory(categoryIds);
        const region = await validateRegion(project.regionId);

        const mergedNotificationList = mergeNotificationLists(region, categories);

        await publish({
          topic: "to_email",
          event: "halt_project",
          message: {
            charity: { name: charity.name, email: user.email },
            project: project,
            notificationList: [...mergedNotificationList],
            reason,
          },
        });
      }

      return await ProjectRepository.update(id, { status });
    }

    return false;
  }

  async activeProject(id) {
    const project = await ProjectRepository.getById(id);
    if (!project) throw new Error("No Project Found");

    if (project.status !== "pending") {
      throw new Error("Cannot activate non-pending Project");
    }

    return await ProjectRepository.update(id, "active");
  }

  async getById(id) {
    const project = await ProjectRepository.getById(id);
    if (!project) {
      throw new Error("Project not found");
    }
    return project;
  }

  async getAll(filters) {
    if (filters.charityName) {
      const charityIds = await CharityRepository.searchByName(filters.charityName);

      if (charityIds.length > 0) {
        filters.charityId = { $in: charityIds };
      } else {
        return { total: 0, page: filters.page || 1, limit: filters.limit || 10, projects: [] };
      }

      delete filters.charityName;
    }

    return await ProjectRepository.getAll(filters);
  }
}

module.exports = new ProjectService();
