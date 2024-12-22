const ProjectRepository = require("./ProjectRepository");

class ProjectService {
  async create(projectData) {
    try {
      // Proceed with project creation
      const project = await ProjectRepository.create(projectData);
      return project;
    } catch (error){
      throw new Error(error.message);
    }
  }

  async delete(id) {
    const project = await ProjectRepository.getById(id);

    if (!project || project.status != "halted") return false;

    return await ProjectRepository.delete(id);
  }

  async getById(id) {
    return await ProjectRepository.getById(id);
  }

  async getAll(filters) {
    const projectData = await ProjectRepository.getAll(filters);
    return projectData;
  }
}

module.exports = new ProjectService();
