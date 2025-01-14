const CompletedProjectService = require("./CompletedProjectService");

class CompletedProjectController {
    async archiveCompletedProject(req, res) {
        try {
            const { projectId } = req.body; // Assume projectId is sent in the request body
            const archivedProject =
                await CompletedProjectService.archiveProject(projectId);
            res.status(200).json({
                message: "Project archived successfully",
                project: archivedProject,
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new CompletedProjectController();
