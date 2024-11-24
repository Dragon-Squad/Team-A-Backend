const ProjectService = require("./ProjectService");

class ProjectController {
  // Create a Project
  async create(req, res) {
    try {
      const projectData = req.body;
      const newProject = await ProjectService.create(projectData);
      res.status(201).json(newProject);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update Project Details
  async update(req, res) {
    try {
      const { id } = req.params;
      const projectData = req.body;
      const updatedProject = await ProjectService.update(id, projectData);
      if (!updatedProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(200).json(updatedProject);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Delete a Project
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ProjectService.delete(id);
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Read a Project by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const project = await ProjectService.getById(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(200).json(project);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get All Projects
  async getAll(req, res) {
    try {
      const filters = req.query; // Extract query params
      const projects = await ProjectService.getAll(filters);
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ProjectController();
