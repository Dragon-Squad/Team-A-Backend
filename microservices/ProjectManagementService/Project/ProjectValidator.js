const validators = require("../utils/requestValidators");

class ProjectValidator {
  validateProjectCreationRequest(projectData) {
    const errors = [];
    validators.isRequired(projectData.charityId, "charityId", errors);
    validators.isString(projectData.charityId, "charityId", errors);

    if (!projectData.categoryIds) {
      errors.push({ field: "categoryIds", message: "categoryIds is required" });
    } else if (!Array.isArray(projectData.categoryIds)) {
        errors.push({ field: "categoryIds", message: "categoryIds must be an array" });
    } else {
        for (const categoryId of projectData.categoryIds) {
            if (typeof categoryId !== 'string') {
                errors.push({ field: "categoryIds", message: "All elements in categoryIds must be strings" });
                break; 
            }
        }
    }

    validators.isRequired(projectData.regionId, "regionId", errors);
    validators.isString(projectData.regionId, "regionId", errors);

    validators.isRequired(projectData.title, "title", errors);
    validators.isString(projectData.title, "title", errors);

    validators.isString(projectData.description, "description", errors);

    validators.isRequired(projectData.goalAmount, "goalAmount", errors);
    validators.isPositiveNumber(projectData.goalAmount, "goalAmount", errors);

    validators.isValidDate(projectData.startDate, "startDate", errors);
    validators.isValidDate(projectData.endDate, "endDate", errors);

    if (new Date(projectData.endDate) <= new Date(projectData.startDate)) {
      errors.push("endDate must be later than startDate.");
    }

    validators.isArrayOfStrings(projectData.images, "images", errors);
    validators.isArrayOfStrings(projectData.videos, "videos", errors);

    if (errors.length > 0) {
      throw new Error(`Validation error: ${errors.join(" ")}`);
    }
  }

  validateProjectUpdateRequest(id, projectData) {
    const errors = [];

    // Ensure the ID is provided
    if (!id) {
      errors.push("Project ID is required.");
    }

    if (projectData.charityId !== undefined) {
      validators.isString(projectData.charityId, "charityId", errors);
    }

    if (projectData.categoryId !== undefined) {
      validators.isString(projectData.categoryId, "categoryId", errors);
    }

    if (projectData.regionId !== undefined) {
      validators.isString(projectData.regionId, "regionId", errors);
    }

    if (projectData.title !== undefined) {
      validators.isString(projectData.title, "title", errors);
    }

    if (projectData.description !== undefined) {
      validators.isString(projectData.description, "description", errors);
    }

    if (projectData.goalAmount !== undefined) {
      validators.isPositiveNumber(projectData.goalAmount, "goalAmount", errors);
    }

    if (projectData.raisedAmount !== undefined) {
      validators.isNonNegativeNumber(
        projectData.raisedAmount,
        "raisedAmount",
        errors
      );
    }

    if (projectData.status !== undefined) {
      validators.isEnumValue(
        projectData.status,
        "status",
        ["pending", "active", "halted", "completed", "deleted"],
        errors
      );
    }

    if (projectData.startDate !== undefined) {
      validators.isValidDate(projectData.startDate, "startDate", errors);
    }

    if (projectData.endDate !== undefined) {
      validators.isValidDate(projectData.endDate, "endDate", errors);
    }

    if (projectData.startDate && projectData.endDate) {
      if (new Date(projectData.endDate) <= new Date(projectData.startDate)) {
        errors.push("endDate must be later than startDate.");
      }
    }

    if (projectData.images !== undefined) {
      validators.isArrayOfStrings(projectData.images, "images", errors);
    }

    if (projectData.videos !== undefined) {
      validators.isArrayOfStrings(projectData.videos, "videos", errors);
    }

    if (projectData.account !== undefined) {
      validators.isString(projectData.account, "account", errors);
    }

    if (errors.length > 0) {
      throw new Error(`Validation error: ${errors.join(" ")}`);
    }
  }
}

module.exports = new ProjectValidator();
