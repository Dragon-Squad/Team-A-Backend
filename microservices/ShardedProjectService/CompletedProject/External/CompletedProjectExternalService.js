const ProjectRepository = require("../CompleteProjectRepository");

class CompletedProjectExternalService {
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

module.exports = new CompletedProjectExternalService();
