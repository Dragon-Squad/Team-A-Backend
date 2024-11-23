const ProjectRepository = require("./ProjectRepository");
const ProjectValidator = require("./ProjectValidator");
const MessageBroker = require("../broker/MessageBroker");

class ProjectService {
  async create(projectData) {
    return await ProjectRepository.create(projectData);
  }
}

module.exports = new ProjectService();
