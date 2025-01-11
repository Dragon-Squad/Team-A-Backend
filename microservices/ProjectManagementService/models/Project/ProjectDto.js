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
  constructor(project, categories, region, charity) {
    this.id = project._id;
    this.title = project.title;
    this.description = project.description;
    this.country = project.country;
    this.goalAmount = project.goalAmount;
    this.raisedAmount = project.raisedAmount;
    this.startDate = project.startDate;
    this.endDate = project.endDate;
    this.status = project.status;
    this.charity = charity; // Assuming charity is an object with relevant fields
    this.categories = categories.map(category => ({
      id: category._id,
      name: category.name // Include only the name of the category
    }));
    this.region = {
      id: region._id,
      name: region.name // Include only the name of the region
    };
    this.createdAt = project.createdAt;
    this.images = project.images;
    this.videos = project.videos;
  }
}

module.exports = {
  CreateProjectRequestDTO,
  UpdateProjectRequestDTO,
  ProjectResponseDTO,
};
