const ProjectRepository = require("../ProjectRepository");
const { publish } = require("../../../broker/Producer");
const {
  ProjectResponseDTO,
  UpdateRaisedAmountDTO,
} = require("./ProjectExternalDto");

class ProjectExternalService {
  async getProjectById(value) {
    try {
      const project = await ProjectRepository.getById(value.projectId);
      await publish({
        topic: "project_to_donation",
        event: "verify_project",
        message: {
          project: project,
        },
      });

      console.log(`public message response: ${project}`);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateProjectRaisedAmount(value) {
    try {
      const { projectId, amount } = new UpdateRaisedAmountDTO(value);
      console.log(
        `Updating project ${projectId} with additional amount: ${amount}`
      );

      const project = await ProjectRepository.getById(projectId);
      if (!project) {
        throw new Error("Project not found");
      }

      // Calculate the new raised amount
      const updatedAmount = project.raisedAmount + amount;
      console.log(`Updated raised amount: ${updatedAmount}`);
      console.log(`Goal amount: ${project.goalAmount}`);

      // If project is completed, handle shard publishing and status update
      if (updatedAmount >= project.goalAmount) {
        console.log(
          `Project ${projectId} has reached its goal and is completed`
        );

        const completedProjectData = {
          raisedAmount: updatedAmount,
          status: "completed",
        };

        const deletionResult = await ProjectRepository.delete(projectId);

        if (deletionResult) {
          await publish({
            topic: "project_to_shard",
            event: "completed_project",
            message: completedProjectData,
          });
        }

        return new ProjectResponseDTO({
          ...project,
          raisedAmount: updatedAmount,
          status: "completed",
        });
      }

      // If the project is not yet completed, update the raised amount
      const updatedProjectData = {
        raisedAmount: updatedAmount,
      };

      const updateResult = await ProjectRepository.update(
        projectId,
        updatedProjectData
      );
      if (!updateResult) throw new Error("Error while updating the Project");

      return new ProjectResponseDTO({
        ...project,
        raisedAmount: updatedAmount,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new ProjectExternalService();
