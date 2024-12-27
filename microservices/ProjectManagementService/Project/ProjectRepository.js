const Project = require("./ProjectSchema");

class ProjectRepository {
  async create(projectData) {
    const project = new Project(projectData);
    return await project.save();
  }

  async update(id, projectData) {
    return await Project.findByIdAndUpdate(id, projectData, { new: true });
  }

  async delete(id) {
    const result = await Project.findByIdAndDelete(id);
    return result !== null; // Returns true if deleted, false if not found
  }

  async getById(id) {
    // Find a project by ID and populate related fields (charity, category, region)
    const project = await Project.findById(id)
      .populate("charityId") // Populates the charityId field with the full Charity document
      .populate("categoryId") // Populates the categoryId field with the full Category document
      .populate("regionId"); // Populates the regionId field with the full Region document

    if (!project) {
      return null; // Return null if no project is found
    }

    return project;
  }

  async getAll(filters) {
    const query = {};
    const {
      charityId,
      categoryId,
      regionId,
      status,
      search,
      page = 1,
      limit = 10,
    } = filters;

    // Add filters to the query object
    if (charityId) query.charityId = charityId;
    if (categoryId) query.categoryId = categoryId;
    if (regionId) query.regionId = regionId;
    if (status) query.status = status;
    if (search) query.title = { $regex: search, $options: "i" };

    // Pagination settings
    const skip = (page - 1) * limit;

    // Find projects and return paginated results
    const projects = await Project.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("charityId") // Populates the charityId field with Charity document
      .populate("categoryId") // Populates the categoryId field with Category document
      .populate("regionId"); // Populates the regionId field with Region document

    const total = await Project.countDocuments(query); // Total count for pagination

    return {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      projects,
    };
  }
}

module.exports = new ProjectRepository();
