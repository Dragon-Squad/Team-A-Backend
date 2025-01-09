const CompletedProject = require("./CompletedProjectSchema");

class CompletedProjectRepository {
  async create(completedProjectData) {
    const completedProject = new CompletedProject(completedProjectData);
    return await completedProject.save();
  }
}

module.exports = new CompletedProjectRepository();
