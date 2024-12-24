const Joi = require("joi");

class ProjectValidator {
  constructor() {
    this.createProjectRequestSchema = Joi.object({
      charityId: Joi.string().required(),
      categoryId: Joi.string().required(),
      regionId: Joi.string().required(),
      title: Joi.string().required(),
      description: Joi.string().optional(),
      goalAmount: Joi.number().positive().required(),
      duration: Joi.string().required(),
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
      status: Joi.string()
        .valid("pending", "active", "halted", "completed", "deleted")
        .required(),
      account: Joi.string().optional(),
      country: Joi.string().optional(),
      images: Joi.array().items(Joi.string()),
      videos: Joi.array().items(Joi.string()),
    });
  }

  validateProjectCreationRequest(projectData) {
    return this.createProjectRequestSchema.validate(projectData);
  }
}

module.exports = new ProjectValidator();
