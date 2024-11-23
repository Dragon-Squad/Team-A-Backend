const Project = require("./ProjectSchema");

class ProjectRepository {
  async create(projectData) {
    const project = new Project(projectData);
    return await project.save();
  }
}

module.exports = new ProjectRepository();
