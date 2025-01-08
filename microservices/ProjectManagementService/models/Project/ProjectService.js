const ProjectValidator = require("./ProjectValidator");
const ProjectRepository = require("./ProjectRepository");
const CategoryService = require("../Category/CategoryService");
const RegionService = require("../Region/RegionService");
const { publish } = require("../../broker/Producer");
const axios = require("axios");
const { ProjectResponseDTO } = require("./ProjectDto");

const TEAM_B_BACKEND_URL = process.env.TEAM_B_BACKEND_URL || "http://172.30.208.1:3000/api";

async function validateCharity(charityId) {
  const charityResponse = await axios.get(
    TEAM_B_BACKEND_URL + `/charities/${charityId}`
  );
  if (!charityResponse.data) 
    throw new Error("No Charity Found");
  
  return charityResponse.data;
}

async function validateCharityName(keyword) {
  const charityResponse = await axios.get(
    TEAM_B_BACKEND_URL + `/charities/search?keyword=${keyword}`
  );
  if (!charityResponse.data) 
    throw new Error("No Charity Found");
  
  return charityResponse.data;
}

async function validateUser(userId) {
  const userResponse = await axios.get(
     TEAM_B_BACKEND_URL + `/users/${userId}`
  );
  if (!userResponse.data) 
    throw new Error("No Email Found");
  
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
  if (!region) 
    throw new Error("Error validating region ID");
  
  return region;
}

function mergeNotificationLists(region, categories) {
  const result = new Set();

  categories.forEach((category) => {
    category.notificationList.forEach((item) => result.add(item));
  });

  region.notificationList.forEach((item) => result.add(item));

  return result;
}

class ProjectService {
  async create(projectData) {
    ProjectValidator.validateProjectCreationRequest(projectData);

    const charity = await validateCharity(projectData.charityId);
    const user = await validateUser(charity.userId);

    const categories = await validateCategory(projectData.categoryIds);
    const categoryIds = categories.map((category) => category._id);

    const region = await validateRegion(projectData.regionId);

    const preparedData = {
      charityId: projectData.charityId,
      categoryIds,
      regionId: region._id,
      title: projectData.title,
      goalAmount: projectData.goalAmount,
      startDate: projectData.startDate,
      endDate: projectData.endDate,
      hashedStripeId: charity.hashedStripeId,
    };

    const project = await ProjectRepository.create(preparedData);

    const projectDTO = new ProjectResponseDTO({
      ...project,
      region,
      categories,
    });

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

    return projectDTO;
  }

  async update(id, projectData) {
    ProjectValidator.validateProjectUpdateRequest(id, projectData);

    if (projectData.charityId) await validateCharity(projectData.charityId);

    if (projectData.categoryId) await validateCategory(projectData.categoryId);

    if (projectData.regionId) await validateRegion(projectData.regionId);

    const updatedProject = await ProjectRepository.update(id, projectData);
    return updatedProject ? new ProjectResponseDTO(updatedProject) : null;
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
        const charity = await validateCharity(reason);
        const user = await validateUser(charity.userId);

        const categoryIds = project.categoryIds.map((category) => category._id);
        console.log(categoryIds);
        const categories = await validateCategory(categoryIds);
        const region = await validateRegion(project.regionId);

        const mergedNotificationList = mergeNotificationLists(
          region,
          categories
        );

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
    if (!project) throw new Error("Project not found");

    const charity = await validateCharity(project.charityId);
    const categories = project.categoryIds; // Directly use the populated fields
    const region = project.regionId;

    return new ProjectResponseDTO(project, categories, region, charity);
  }

  async getAll(filters) {
    if (filters.charityName) {
      const charityIds = await validateCharityName(filters.charityName);

      if (charityIds.length > 0) {
        if (!Array.isArray(filters.charityIds)) {
          filters.charityIds = [filters.charityIds];
        }     
      } else {
        return {
          total: 0,
          page: filters.page || 1,
          limit: filters.limit || 10,
          projects: [],
        };
      }

      delete filters.charityName;
    }

    if (filters.categoryIds) {
      if (!Array.isArray(filters.categoryIds)) {
        filters.categoryIds = [filters.categoryIds];
      }
    }

    const projects = await ProjectRepository.getAll(filters);
    return Promise.all(projects.map(async (project) => {
      const charity = await validateCharity(project.charityId);
      const categories = project.categoryIds; // Directly use the populated categoryIds
      const region = project.regionId; // Directly use the populated regionId
  
      return new ProjectResponseDTO(project, categories, region, charity); // Pass all data
    }));
  }

  async getTotalProjects(filters) {
    const query = {};
    if (filters.country) query.country = filters.country;
    if (filters.continent) query.continent = filters.continent;
    if (filters.categoryId) query.categoryIds = { $in: [filters.categoryId] };

    const total = await ProjectRepository.countDocuments(query);
    return { total };
  }

  async getTotalProjectStatus(filters) {
    const query = {};
    if (filters.year) {
      const startDate = new Date(filters.year, 0, 1);
      const endDate = new Date(filters.year + 1, 0, 1);
      query.createdAt = { $gte: startDate, $lt: endDate };
    }
    if (filters.month) {
      const startDate = new Date(filters.year, filters.month - 1, 1);
      const endDate = new Date(filters.year, filters.month, 1);
      query.createdAt = { $gte: startDate, $lt: endDate };
    }
    if (filters.week) {
      const startDate = new Date(filters.year, filters.month - 1, filters.week * 7);
      const endDate = new Date(filters.year, filters.month - 1, (filters.week + 1) * 7);
      query.createdAt = { $gte: startDate, $lt: endDate };
    }

    return await ProjectRepository.countByStatusAndDate(query);
  }
}

module.exports = new ProjectService();
