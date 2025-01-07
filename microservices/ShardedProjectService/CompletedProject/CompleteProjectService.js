const CompletedProjectRepository = require("./CompletedProjectRepository");
const ArchivedProjectRepository = require("./ArchivedProjectRepository"); // New repository for archived projects

class CompletedProjectService {
    async archiveProject(projectId) {
        const completedProject = await CompletedProjectRepository.getById(projectId);
        if (!completedProject) throw new Error("Project not found");

        // Logic to move to archived database/shard
        const archivedProject = await ArchivedProjectRepository.create(completedProject);
        await CompletedProjectRepository.delete(projectId); // Optionally delete from completed projects

        // TODO: use EmailService for Notify charity (implement notification logic)
        // await this.notifyCharity(completedProject.charityId, completedProject);

        return archivedProject;
    }

  
}

module.exports = new CompletedProjectService();