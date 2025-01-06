const Joi = require("joi");

// Request DTOs
const CreateProjectRequestDTO = Joi.object({
  charityId: Joi.string().required(),
  categoryIds: Joi.array().items(Joi.string()).required(),
  regionId: Joi.string().required(),
  title: Joi.string().required(),
  goalAmount: Joi.number().positive().required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().required(),
});

const UpdateProjectRequestDTO = Joi.object({
  charityId: Joi.string().optional(),
  categoryIds: Joi.array().items(Joi.string()).optional(),
  regionId: Joi.string().optional(),
  title: Joi.string().optional(),
  goalAmount: Joi.number().positive().optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
});

// Response DTOs
class ProjectResponseDTO {
  constructor(project) {
    this.id = project._id;
    this.title = project.title;
    this.goalAmount = project.goalAmount;
    this.startDate = project.startDate;
    this.endDate = project.endDate;
    this.status = project.status;
    this.charityId = project.charityId;
    this.categoryIds = project.categoryIds;
    this.regionId = project.regionId;
  }
}

module.exports = {
  CreateProjectRequestDTO,
  UpdateProjectRequestDTO,
  ProjectResponseDTO,
};
