const ProjectRepository = require("./ProjectRepository");
const ProjectValidator = require("./ProjectValidator");
const MessageBroker = require("../broker/MessageBroker");

class ProjectService {
  async create(projectData) {
    return await ProjectRepository.create(projectData);
  }

  async update(id, projectData) {
    return await ProjectRepository.update(id, projectData);
  }

  async delete(id) {
    const project = await ProjectRepository.getById(id);

    if (!project || project.status != "halted") return false;

    return await ProjectRepository.delete(id);
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

  async getById(id) {
    return await ProjectRepository.getById(id);
  }

  async getAll(filters) {
    return await ProjectRepository.getAll(filters);
  }
}

module.exports = new ProjectService();
