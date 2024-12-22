const ProjectRepository = require("../ProjectRepository");
const { publish } = require("../../broker/Producer");

class ProjectService {
  async getProjectById(value) {
    try{
        const project = await ProjectRepository.getById(value.projectId);

        await publish({
            topic: "project_to_donation",
            event: "verify_project",
            message: {
                project: project,
                correlationId: value.correlationId,
            },
        });
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

        // Determine the new status
        let status = project.status;
        if (updatedAmount >= project.goalAmount) {
            status = "closed";
        }

        // Update the project data
        const updatedProjectData = {
            raisedAmount: updatedAmount,
            status: status,
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
}

module.exports = new ProjectService();
