const ProjectValidator = require("./ProjectValidator");
const ProjectRepository = require("./ProjectRepository");
const CategoryService = require("../Category/CategoryService");
const CharityRepository = require("../Charity/CharityRepository");
const RegionService = require("../Region/RegionService");
const { publish } = require("../broker/Producer");
const axios = require("axios");

class ProjectService {
  async create(projectData) {
    // Validate project creation data
    ProjectValidator.validateProjectCreationRequest(projectData);

    const response = await axios.get(`http://172.30.208.1:3000/api/charities/${projectData.charityId}`);

    if (!response.data) {
      throw new Error("Error validating charity ID");
    } 

    const category = await CategoryService.getCategoryById(project.categoryId);
    if(!category){
      throw new Error("Error validating category ID");
    }

    const region = await RegionService.getRegionById(project.regionId);
    if(!region){
      throw new Error("Error validating region ID");
    }

    // Proceed with project creation
    const project = await ProjectRepository.create(projectData);

    // Get the notification list from category and region
    const mergedNotificationList = new Set([
      ...region.notificationList.map(String),
      ...category.notificationList,
    ]);
    
    await publish({
      topic: "project_to_email",
      event: "create_project",
      message: {
          project: project,
          notificationList: mergedNotificationList,
      },
  });

    return project;
  }

  async update(id, projectData) {
    // Validate project update data
    ProjectValidator.validateProjectUpdateRequest(id, projectData);

    if(projectData.charityId){
      const response = await axios.get(`http://172.30.208.1:3000/api/charities/${projectData.charityId}`);

      if (!response.data) {
        throw new Error("Error validating charity ID");
      } 
    }

    if(projectData.categoryId){
      const category = await CategoryService.getCategoryById(project.categoryId);
      if(!category){
        throw new Error("Error validating category ID");
      }
    }

    if(projectData.regionId){
      const region = await RegionService.getRegionById(project.regionId);
      if(!region){
        throw new Error("Error validating region ID");
      }
    }

    // Proceed with update
    return await ProjectRepository.update(id, projectData);
  }

  async delete(id) {
    const project = await ProjectRepository.getById(id);

    if (!project || project.status != "halted") return false;

    const result = await ProjectRepository.delete(id);

    if (result) {
      await publish({
        topic: "project_to_shard",
        event: "deleted_project",
        message: project,
      });
    }
  }

  async updateStatus(id, status) {
    const project = await ProjectRepository.getById(id);
    if (!project) return false;

    // To halt, Only Active Projects can be halted
    // To resume, Only Halted Projects can be resumed
    if (
      (project.status == "active" && status == "halted") ||
      (project.status == "halted" && status == "active")
    )
      return await ProjectRepository.update(id, { status });

    return false;
  }

  async activeProject(id) {
    const project = await ProjectRepository.getById(id);
    if (!project) throw new Error("No Project Found");

    if (project.status != "pending")
      throw new Error("Cannot active non-pending Project");

    return await ProjectRepository.update(id, "active");
  }

  async getById(id) {
    // Get the project by ID and populate related fields (charity, category, region)
    const project = await ProjectRepository.getById(id);
    if (!project) {
      throw new Error("Project not found");
    }

    return project;
  }

  // Service: Get All Projects
  async getAll(filters) {
    // Check if charity name is present in the filters
    if (filters.charityName) {
      // Use the CharityRepository to search by charity name and get the charityId(s)
      const charityIds = await CharityRepository.searchByName(
        filters.charityName
      );

      // If charityIds are found, set the charityId filter to use the charityIds array
      if (charityIds.length > 0) {
        filters.charityId = { $in: charityIds }; // Update the charityId filter with an array of charityIds
      } else {
        // If no matching charity is found, return an empty result
        return {
          total: 0,
          page: filters.page || 1,
          limit: filters.limit || 10,
          projects: [],
        };
      }
      // Remove charityName from filters to prevent it being used in the query
      delete filters.charityName;
    }

    return await ProjectRepository.getAll(filters);
  }
}

module.exports = new ProjectService();
