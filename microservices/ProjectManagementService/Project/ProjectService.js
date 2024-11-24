const ProjectRepository = require("./ProjectRepository");
const ProjectValidator = require("./ProjectValidator");
const MessageBroker = require("../broker/MessageBroker");

class ProjectService {
  async create(projectData) {
    return await ProjectRepository.create(projectData);
  }

  async getById(id) {
    return await ProjectRepository.getById(id);
  }

  async getAll(filters) {
    return await ProjectRepository.getAll(filters);
  }
}

module.exports = new ProjectService();
