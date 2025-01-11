require('dotenv').config();

const { publish } = require("../broker/Producer"); 

const CompletedProjectRepository = require("./CompletedProjectRepository");

const TEAM_B_BACKEND_URL = process.env.TEAM_B_BACKEND_URL || "http://100.112.207.9:3000/api";

class CompletedProjectService {
    async archiveProject(projectId) {
        const completedProject = await CompletedProjectRepository.getById(projectId);
        if (!completedProject) throw new Error("Project not found");

        // Fetch the charity's user ID
        const charityResponse = await axios.get(TEAM_B_BACKEND_URL + `/charities/${completedProject.charityId}/userId`);
        const charity = charityResponse.data;

        const userId = charity.userId; // Assuming the response contains userId

        // Fetch the user's email address
        const userResponse = await axios.get(TEAM_B_BACKEND_URL + `/users/${userId}`);
        const userEmail = userResponse.data.email; // Assuming the response contains email

       // Notify charity
        await this.notifyCharity(userEmail, charity, completedProject);

        return archivedProject;
    }

   
    async notifyCharity(userEmail, charity, project) {
        const message = {
            value: {
                charity: charity,
                project: project,
                userEmail: userEmail
            }
        };
        await kafkaProducer.send({
            topic: "to_email",
            event: "charity_project_completed",
            messages: [message]
        });
    }
  
}

module.exports = new CompletedProjectService();