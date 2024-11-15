const ProjectService = require('./ProjectService');

class ProjectController {
  // Method to get all projects 
  async getAllProjects(req, res) {
    try {
      const page = parseInt(req.query.page) || 1; 
      const limit = parseInt(req.query.limit) || 10; 
      const filters = {
        month: req.query.month,
        region: req.query.region,
        country: req.query.country,
        category: req.query.category,
        search: req.query.search
      };
      const donorCountry = req.query.donorCountry || 'Vietnam';

      const projects = await ProjectService.getAllProjects(page, limit, filters, donorCountry);
      return res.status(200).json(projects);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async getActiveProjects(req, res) {
    try {
      console.log("Controller Executes");
      const page = parseInt(req.query.page) || 1; 
      const limit = parseInt(req.query.limit) || 10; 
      const filters = {
        month: req.query.month,
        region: req.query.region,
        country: req.query.country,
        category: req.query.category,
        search: req.query.search
      };
      const donorCountry = req.query.donorCountry || 'Vietnam';
      const projects = await ProjectService.getActiveProjects(page, limit, filters, donorCountry);
      return res.status(200).json(projects);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  // Method to get a project by ID
  async getProjectById(req, res) {
    try {
      const projectId = req.params.id; 
      const project = await ProjectService.getProjectById(projectId);
      return res.status(200).json(project);
    } catch (err) {
      return res.status(404).json({ error: err.message });
    }
  }

  async getProjectsByCharity(req, res) {
    try {
      const userId = req.params.id; 
      const page = parseInt(req.query.page) || 1; 
      const limit = parseInt(req.query.limit) || 10; 
      getProjectsByCharity
      const results = await ProjectService.getMyProjects(userId, page, limit);
      return res.status(200).json(results);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  // Method to create a new project
  async createProject(req, res) {
    try {
      const projectData = req.body; 
      const role = req.role; 
      const userId = req.id; 

      const newProject = await ProjectService.createProject(projectData, role, userId);
      return res.status(201).json({ message: 'Project created successfully', project: newProject });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  // Method to update a project
  async updateProject(req, res) {
    try {
      const projectId = req.params.id; 
      const projectData = req.body; 
      const userId = req.id; 
      const role = req.role; 

      const updatedProject = await ProjectService.updateProject(projectId, projectData, userId, role);
      return res.status(200).json({ message: 'Project updated successfully', project: updatedProject });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  // Method for admin to activate a pending project
  async activateProject(req, res) {
    try {
      const projectId = req.params.id; 
      await ProjectService.activateProject(projectId);
      return res.status(200).json({ message: 'Project activated successfully' });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  // Method for charity owner to halt an active project
  async haltProject(req, res) {
    try {
      const projectId = req.params.id; 
      const userId = req.id; 

      await ProjectService.haltProject(projectId, userId);
      return res.status(200).json({ message: 'Project halted successfully' });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  // Method for admin to delete a project
  async deleteProject(req, res) {
    try {
      const projectId = req.params.id; 
      const role = req.role;
      const userId = req.id;
      await ProjectService.deleteProject(projectId, role, userId);
      return res.status(200).json({ message: 'Project deleted successfully' });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new ProjectController();