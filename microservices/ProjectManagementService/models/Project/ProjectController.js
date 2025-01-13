const ProjectService = require("./ProjectService");
const RedisMiddleware = require("../../redisMiddleware");
const hash = require("object-hash");
const { CreateProjectRequestDTO, UpdateProjectRequestDTO } = require("./ProjectDto");

class ProjectController {
  // Create a Project
  async create(req, res) {
    try {
      const accessToken = req.cookies.accessToken;
      // const projectData = await CreateProjectRequestDTO.validateAsync(req.body, accessToken);
      const response = await ProjectService.create(req.body, accessToken);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Update Project Details
  async update(req, res) {
    try {
      const accessToken = req.cookies.accessToken;
      const { id } = req.params;
      // const projectData = await UpdateProjectRequestDTO.validateAsync(req.body, accessToken);
      const response = await ProjectService.update(id, req.body, accessToken);
      if (!response)
        return res.status(404).json({ message: "Project not found" });

      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Delete a Project
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ProjectService.delete(id);
      if (!deleted)
        return res
          .status(404)
          .json({ message: "Project not found or status isn't halted" });

      res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Activate a Project
  async active(req, res) {
    try {
      const { id } = req.params;
      const response = await ProjectService.activeProject(id);
      res.status(200).json("The Project is set to Active successfully");
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Halt a Project
  async halt(req, res) {
    try {
      const accessToken = req.cookies.accessToken;
      const { id } = req.params;
      const reason = req.body.reason;
      const haltedProject = await ProjectService.updateStatus(
        id,
        "halted",
        reason,
        accessToken
      );
      if (!haltedProject)
        return res.status(404).json({ message: "Project not found" });

      res.status(200).json(haltedProject);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Resume a Project
  async resume(req, res) {
    try {
      const accessToken = req.cookies.accessToken;
      const { id } = req.params;
      const resumedProject = await ProjectService.updateStatus(
        id,
        "active",
        "",
        accessToken
      );
      if (!resumedProject)
        return res.status(404).json({ message: "Project not found" });

      res.status(200).json(resumedProject);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Read a Project by ID
  async getById(req, res) {
    try {
      const accessToken = req.cookies.accessToken;
      const { id } = req.params;
      const clientId = req.headers["x-client-id"] || req.ip; // Use client ID or IP for hashing
      const cacheKey = `project:${id}`;

      // Check Redis cache
      // const cachedProject = await RedisMiddleware.readData(clientId, cacheKey);
      // if (cachedProject) {
      //   console.log("Cache hit for project ID:", id);
      //   return res.status(200).json(cachedProject);
      // }

      // Fetch from database if not cached
      const project = await ProjectService.getById(id, accessToken);
      if (!project)
        return res.status(404).json({ message: "Project not found" });

      // Cache the result
      // await RedisMiddleware.writeData(clientId, cacheKey, project);

      res.status(200).json(project);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get All Projects
  async getAll(req, res) {
    try {
      const accessToken = req.cookies.accessToken;
      const filters = req.query;
      const clientId = req.headers["x-client-id"] || req.ip; // Use client ID or IP for hashing
      const cacheKey = `projects:${hash.sha1(filters)}`; // Generate a unique key for filters

      // Check Redis cache
      // const cachedProjects = await RedisMiddleware.readData(clientId, cacheKey);
      // if (cachedProjects) {
      //   console.log("Cache hit for project list with filters:", filters);
      //   return res.status(200).json(cachedProjects);
      // }

      // Fetch from database if not cached
      const projects = await ProjectService.getAll(filters, accessToken);

      // Cache the result
      // await RedisMiddleware.writeData(clientId, cacheKey, projects);

      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getTotalProjects(req, res) {
    try {
      const filters = req.query;
      const total = await ProjectService.getTotalProjects(filters);
      res.status(200).json(total);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getTotalProjectStatus(req, res) {
    try {
      const filters = req.query;
      const statusCounts = await ProjectService.getTotalProjectStatus(filters);
      res.status(200).json(statusCounts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ProjectController();
