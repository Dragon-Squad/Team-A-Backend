const ProjectRepository = require("../DeletedProjectRepository");

class DeletedProjectExternalService {
  async create(projectData) {
    try {
      // Proceed with project creation
      const project = await ProjectRepository.create(projectData);
      return project;
    } catch (error){
      throw new Error(error.message);
    }
  }
}

module.exports = new DeletedProjectExternalService();
