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
}

module.exports = new ProjectController();
