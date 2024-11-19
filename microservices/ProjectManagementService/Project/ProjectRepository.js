const Project = require('./ProjectSchema');

class ProjectRepository {
    async create(data) {
        const project = new Project(data);
        //convert the saving process into a boolean
        return !!(await project.save());
    }

  async findById(id) {
    return await Project.findById(id);
  }

  async update(id, data) {
    return await Project.findByIdAndUpdate(id, data, { new: true });
  }

  async getAll(page, limit, filters, donorCountry) {
    const { status, month, region, country, category, search, charityList } = filters;
    const query = {};
  
    if (status) query.status = status;
  
    // Filter by created month
    if (month) {
      const startDate = new Date(new Date().getFullYear(), month - 1, 1);
      const endDate = new Date(new Date().getFullYear(), month, 1);
      query.createdAt = { $gte: startDate, $lt: endDate };
    }
  
    // Filter by region, country, and category
    if (region) query.regionId = region;
    if (country) query.country = country;
    if (category) query.categoryId = category;
  
    // Filter by charityList if provided
    if (charityList) {
      query.charityId = { $in: charityList };
    }
  
    // Search by title
    if (search && charityList.length == 0) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
      ];
    }
  
    const results = await Project.aggregate([
        { $match: query },
        {
          $facet: {
            matchingCountry: [
              { $match: { country: donorCountry } },
              { $sort: { createdAt: -1 } } 
            ],
            otherProjects: [
              { $match: { country: { $ne: donorCountry } } }, 
              { $sort: { createdAt: -1 } } 
            ]
          }
        },
        {
          $project: {
            results: { $concatArrays: ["$matchingCountry", "$otherProjects"] } 
          }
        },
        { $unwind: "$results" },
        { $replaceRoot: { newRoot: "$results" } },
        { $skip: (page - 1) * limit },
        { $limit: limit }
      ]);
    
      const totalProjects = await Project.countDocuments(query);
      return {
        results: results,
        totalProjects: totalProjects
      }
  }

  async getActiveProjects(page, limit, filters, donorCountry) {
    const { month, region, country, category, search, charityList } = filters;
    console.log(filters);
    const query = {};
    // query.status = 'active';
    // Filter by created month
    if (month) {
      const startDate = new Date(new Date().getFullYear(), month - 1, 1);
      const endDate = new Date(new Date().getFullYear(), month, 1);
      query.createdAt = { $gte: startDate, $lt: endDate };
    }
  
    // Filter by region, country, and category
    if (region) query.regionId = region;
    if (country) query.country = country;
    if (category) query.categoryId = category;
  
    // Filter by charityList if provided
    if (charityList && charityList.length > 0) {
      query.charityId = { $in: charityList };
    }
  
    // Search by title or charity name
    if (search && charityList.length == 0) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
      ];
      console.log("Execute 2");
    }
  
    const results = await Project.aggregate([
      { $match: query },
      {
        $facet: {
          matchingCountry: [
            { $match: { country: donorCountry } },
            { $sort: { createdAt: -1 } } 
          ],
          otherProjects: [
            { $match: { country: { $ne: donorCountry } } }, 
            { $sort: { createdAt: -1 } } 
          ]
        }
      },
      {
        $project: {
          results: { $concatArrays: ["$matchingCountry", "$otherProjects"] } 
        }
      },
      { $unwind: "$results" },
      { $replaceRoot: { newRoot: "$results" } },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ]);
  
    const totalProjects = await Project.countDocuments(query);
    return {
      results: results,
      totalProjects: totalProjects
    }
  }
  

  async getProjectsByCharity(charityId, page, limit) {
    const offset = (page - 1) * limit;
    return {
      results: await Project.find({ charity: charityId })
            .skip(offset)
            .limit(limit),
      totalProjects: await Project.countDocuments({ charity: charityId })
  }
  }
}

module.exports = new ProjectRepository();