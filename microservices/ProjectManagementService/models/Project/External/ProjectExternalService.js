const ProjectRepository = require("../ProjectRepository");
const { publish } = require("../../../broker/Producer");
const CategoryExternalService = require("../../Category/External/CategoryExternalService");
const RegionExternalService = require("../../Region/External/RegionExternalService");

class ProjectService {
  async getProjectById(value) {
    try{
        const project = await ProjectRepository.getById(value.projectId);
        await publish({
            topic: "project_to_donation",
            event: "verify_project",
            message: {
                project: project,
            },
        });

        console.log(`public message response: ${project}`);
    } catch (error){
        throw new Error(error.message);
    }
  }

  async updateProjectRaisedAmount(value){
    try{
        console.log(value);
        const project = await ProjectRepository.getById(value.projectId);
        if (!project) {
            throw new Error("Project not found");
        }

        // Calculate the new raised amount
        const updatedAmount = project.raisedAmount + value.amount;
        console.log(`updated amount: ${updatedAmount}`);
        console.log(`goal amount: ${project.goalAmount}`);

        // Move the project to shard if it is completed
        if (updatedAmount >= project.goalAmount) {
            const updatedProjectData = {
                ...project,
                raisedAmount: updatedAmount,
                status: "completed",
            };

            const result = await ProjectRepository.delete(value.projectId);

            if(result){
                await publish({
                  topic: "project_to_shard",
                  event: "completed_project",
                  message: updatedProjectData._doc,
                });
            }

            return;
        }

        // Update the project data if it is still not completed
        const updatedProjectData = {
            raisedAmount: updatedAmount,
        };

        // Update the project using the repository
        const result = await ProjectRepository.update(value.projectId, updatedProjectData);
        if(!result) {
            throw new Error("Error while updating the Project");
        }
    } catch (error){
        throw new Error(error.message);
    }
  }

  async getProjectsByFilter(value){
    const filters = value || {};
    console.log(value);
    const projects = await ProjectRepository.getAll(filters);

    await publish({
        topic: "to_stat",
        event: "project_by_filter",
        message: projects,
    });
  }

  async getNames(value){
    console.log(value);
    const categoryIds = value.slice(0, 2);
    const regionIds = value.slice(2);

    const categoryNames = await CategoryExternalService.getCategoryNamesByIds(categoryIds);
    const regionNames = await RegionExternalService.getRegionNamesByIds(regionIds);

    await publish({
        topic: "to_stat",
        event: "return_names",
        message: [...categoryNames, ...regionNames],
    });
  }
}

module.exports = new ProjectService();
