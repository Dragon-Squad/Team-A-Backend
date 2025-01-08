require('dotenv').config();

const { kafkaProducer } = require("../broker/Producer"); // Import Kafka producer

const CompletedProjectRepository = require("./CompletedProjectRepository");
const ArchivedProjectRepository = require("./ArchivedProjectRepository"); // New repository for archived projects

const TEAM_B_BACKEND_URL = process.env.TEAM_B_BACKEND_URL || "http://172.30.208.1:3000/api";

class CompletedProjectService {
    async archiveProject(projectId) {
        const completedProject = await CompletedProjectRepository.getById(projectId);
        if (!completedProject) throw new Error("Project not found");

       // Logic to move to archived database/shard
       const archivedProject = await ArchivedProjectRepository.create(completedProject);
       await CompletedProjectRepository.delete(projectId); // Optionally delete from completed projects

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
            key: "charity_project_completed",
            value: {
                charity: charity,
                project: project,
                userEmail: userEmail
            }
        };
        await kafkaProducer.send({
            topic: "to_email",
            messages: [message]
        });
    }
  
}

module.exports = new CompletedProjectService();