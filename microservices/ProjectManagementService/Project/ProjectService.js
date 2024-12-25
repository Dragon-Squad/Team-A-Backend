const validators = require("../utils/requestValidators");
const ProjectRepository = require("./ProjectRepository");
const CategoryService = require("../Category/CategoryService");
const RegionService = require("../Region/RegionService");
const { publish } = require("../broker/Producer");

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
    const project = await ProjectRepository.create(projectData);

    //get the notification list from category and region
    const category = await CategoryService.getCategoryById(project.categoryId);
    const region = await RegionService.getRegionById(project.regionId);
    const mergedNotificationList = new Set([
      ...region.notificationList.map(String),
      ...category.notificationList
    ]);

    return project;
  }

  async update(id, projectData) {
    return await ProjectRepository.update(id, projectData);
  }

  async delete(id) {
    const project = await ProjectRepository.getById(id);

    if (!project || project.status != "halted") return false;

    const result = await ProjectRepository.delete(id);

    if(result){
      await publish({
        topic: "project_to_shard",
        event: "deleted_project",
        message: project,
      });
    }
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

  async activeProject(id){
    const project = await ProjectRepository.getById(id);
    if (!project) throw new Error("No Project Found");

    if (project.status != "pending") throw new Error("Cannot active non-pending Project");

    return await ProjectRepository.update(id, "active");
  }

  async getById(id) {
    return await ProjectRepository.getById(id);
  }

  async getAll(filters) {
    // const search = filters.search;
    // let charityList, categoryId, regionId;
  
    // if (search) {
    //   await MessageProducer.publish({
    //     topic: "project_to_charity",
    //     event: "search_charity",
    //     message: search,
    //   });
  
    //   // Subscribe to the topic once before sending the message
    //   const consumer = await MessageConsumer.connectConsumer();
    //   await consumer.subscribe({ topic: "charity_to_project", fromBeginning: true });
    //   console.info(`Subscribed to topic: charity_to_project`);
  
    //   consumer.run({
    //     onmessage: async ({ topic, partition, message }) => {
    //       try {
    //         const value = message.value ? JSON.parse(message.value.toString()) : null;
    //         if (value) {
    //           charityList = value; 
    //           console.info({ topic, partition, key, offset: message.offset }, "Message received");
    //         } else {
    //           console.warn("Empty message received");
    //         }
    //       } catch (error) {
    //         console.error("Error processing message:", error);
    //       }
    //     },
    //   });
  
    //   // Wait for the loop to break when charityList is set
    //   while (!charityList) {
    //     console.log("Waiting for kafka response...");
    //     await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before checking again
    //   }
    // }
  
    const projectData = await ProjectRepository.getAll(filters);
    // ... (rest of your logic)
    return projectData;
  }
}

module.exports = new ProjectService();
