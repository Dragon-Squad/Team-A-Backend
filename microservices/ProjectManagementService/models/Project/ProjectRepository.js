const Project = require("./ProjectSchema");
var ObjectId = require("mongodb").ObjectId;

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
        return result !== null;
    }

    async getById(id) {
        // Find a project by ID and populate related fields (charity, category, region)
        const project = await Project.findById(id)
            .populate("categoryIds") // Populates the categoryId field with the full Category document
            .populate("regionId"); // Populates the regionId field with the full Region document

        if (!project) return null; // Return null if no project is found

        return project;
    }

    async getAll(filters) {
        const query = {};
        const {
            charityIds,
            categoryIds,
            country,
            regionId,
            status,
            search,
            page = 1,
            limit = 10,
        } = filters;

        let realCharityIds = null;
        if (charityIds) {
            if (typeof charityIds === "string") {
                realCharityIds = [new ObjectId(charityIds)];
            } else {
                realCharityIds = charityIds.map((id) => new ObjectId(id));
            }
        }
        
        let realCategoryIds = null;
        if (categoryIds) {
            if (typeof categoryIds === "string") {
                realCategoryIds = [new ObjectId(categoryIds)];
            } else {
                realCategoryIds = categoryIds.map((id) => new ObjectId(id));
            }
        }

        // Add filters to the query object
        if (realCharityIds) query.charityId = { $in: realCharityIds };
        if (realCategoryIds) query.categoryIds = { $in: realCategoryIds };
        if (country) query.country = { $regex: country, $options: "i" };
        if (regionId) query.regionId = regionId;
        if (status) query.status = status;
        if (search) query.title = { $regex: search, $options: "i" };

        // Pagination settings
        const skip = (page - 1) * limit;

        // Find projects and return paginated results
        const projects = await Project.find(query)
            .skip(skip)
            .limit(parseInt(limit))
            .populate("categoryIds") // Populates the categoryId field with Category document
            .populate("regionId"); // Populates the regionId field with Region document

        const total = await Project.countDocuments(query); // Total count for pagination

        return {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            projects,
        };
    }

    async getCharityId(id) {
        const project = await Project.findById(id);
        return project.charityId.toString;
    }

    async countDocuments(query) {
        return await Project.countDocuments(query);
    }

    async countByStatusAndDate(query) {
        const activeCount = await Project.countDocuments({
            ...query,
            status: "active",
        });
        const completedCount = await Project.countDocuments({
            ...query,
            status: "completed",
        });
        return { activeCount, completedCount };
    }
}

module.exports = new ProjectRepository();
