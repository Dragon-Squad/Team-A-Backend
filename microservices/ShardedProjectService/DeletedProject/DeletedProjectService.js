const DeletedProjectRepository = require("./DeletedProjectRepository");

class DeletedProjectService {
    async delete(id) {
        const deletedProject = await DeletedProjectRepository.getById(id);

        if (!deletedProject || deletedProject.status != "halted") return false;

        return await DeletedProjectRepository.delete(id);
    }

    async getById(id) {
        return await DeletedProjectRepository.getById(id);
    }

    async getAll(filters) {
        const deletedProjectData = await DeletedProjectRepository.getAll(
            filters
        );
        return deletedProjectData;
    }
}

module.exports = new DeletedProjectService();
