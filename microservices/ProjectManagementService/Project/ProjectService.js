const validators = require("../utils/requestValidators");
const ProjectRepository = require("./ProjectRepository");
const ProjectValidator = require("./ProjectValidator");
const MessageBroker = require("../broker/MessageBroker");

class ProjectService {
  async create(projectData) {
    const errors = [];

    // Use validation helpers
    validators.isRequired(projectData.charityId, "charityId", errors);
    validators.isString(projectData.charityId, "charityId", errors);

    validators.isRequired(projectData.categoryId, "categoryId", errors);
    validators.isString(projectData.categoryId, "categoryId", errors);

    validators.isRequired(projectData.regionId, "regionId", errors);
    validators.isString(projectData.regionId, "regionId", errors);

    validators.isRequired(projectData.title, "title", errors);
    validators.isString(projectData.title, "title", errors);

    validators.isString(projectData.description, "description", errors);

    validators.isRequired(projectData.goalAmount, "goalAmount", errors);
    validators.isPositiveNumber(projectData.goalAmount, "goalAmount", errors);

    if (typeof projectData.raisedAmount !== "undefined") {
      validators.isNonNegativeNumber(
        projectData.raisedAmount,
        "raisedAmount",
        errors
      );
    }

    validators.isRequired(projectData.status, "status", errors);
    validators.isEnumValue(
      projectData.status,
      "status",
      ["pending", "active", "halted", "closed"],
      errors
    );

    validators.isValidDate(projectData.endDate, "endDate", errors);

    validators.isArrayOfStrings(projectData.images, "images", errors);
    validators.isArrayOfStrings(projectData.videos, "videos", errors);

    validators.isString(projectData.account, "account", errors);

    // Throw if there are errors
    if (errors.length > 0) {
      throw new Error(`Validation error: ${errors.join(" ")}`);
    }

    // Proceed with project creation
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
