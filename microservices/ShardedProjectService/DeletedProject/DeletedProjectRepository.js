const DeletedProject = require("./DeletedProjectSchema");

class DeletedProjectRepository {
  async create(DeletedProjectData) {
    const deletedProject = new DeletedProject(DeletedProjectData);
    return await deletedProject.save();
  }

  async getById(id) {
    return await DeletedProject.findById(id);
  }

  async delete(id) {
    const result = await DeletedProject.findByIdAndDelete(id);
    return result !== null; // Returns true if deleted, false if not found
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

    // Find DeletedProjects and return paginated results
    const DeletedProjects = await DeletedProject.find(query)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await DeletedProject.countDocuments(query); // Total count for pagination

    return {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      DeletedProjects,
    };
  }
}

module.exports = new DeletedProjectRepository();
