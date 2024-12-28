const DeletedProjectService = require("./DeletedProjectService");

class DeletedProjectController {
  // Delete a DeletedProject
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await DeletedProjectService.delete(id);
      if (!deleted) {
        return res
          .status(404)
          .json({ message: "DeletedProject not found or status isn't halted" });
      }
      res.status(200).json({ message: "DeletedProject deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Read a DeletedProject by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const deletedProject = await DeletedProjectService.getById(id);
      if (!deletedProject) {
        return res.status(404).json({ message: "DeletedProject not found" });
      }
      res.status(200).json(deletedProject);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get All DeletedProjects
  async getAll(req, res) {
    try {
      const filters = req.query; // Extract query params
      const deletedProjects = await DeletedProjectService.getAll(filters);
      res.status(200).json(deletedProjects);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new DeletedProjectController();
