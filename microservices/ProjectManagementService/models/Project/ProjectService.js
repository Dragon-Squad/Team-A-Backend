const ProjectValidator = require("./ProjectValidator");
const ProjectRepository = require("./ProjectRepository");
const { publish } = require("../../broker/Producer");
const {
    ProjectResponseDTO,
    ProjectUpdateResponseDTO,
} = require("./ProjectDto");
const {
    validateCharity,
    validateCharityName,
    validateUser,
    validateCategory,
    validateRegion,
    mergeNotificationLists,
} = require("../../utils/projectServiceUtils");

class ProjectService {
    async create(projectData, accessToken) {
        ProjectValidator.validateProjectCreationRequest(projectData);
        const charity = await validateCharity(
            projectData.charityId,
            accessToken
        );
        const user = await validateUser(charity.userId);

        const categories = await validateCategory(projectData.categoryIds);
        const categoryIds = categories.map((category) => category._id);

        const region = await validateRegion(projectData.regionId);

        const preparedData = {
            charityId: projectData.charityId,
            categoryIds,
            regionId: region._id,
            title: projectData.title,
            goalAmount: projectData.goalAmount,
            startDate: projectData.startDate,
            endDate: projectData.endDate,
            hashedStripeId: charity.hashedStripeId,
        };

        const project = await ProjectRepository.create(preparedData);

        const projectDTO = new ProjectResponseDTO(
            project,
            categories,
            region,
            charity
        );

        const result = mergeNotificationLists(region, categories);
        const mergedNotificationList = result.notificationList;
        const userList = result.userList;

        await publish({
            topic: "to_email",
            event: "create_project",
            message: {
                charity: { name: charity.name, email: user.email },
                project: projectDTO,
                notificationList: [...mergedNotificationList],
                userList: [...userList],
            },
        });

        return projectDTO;
    }

    async update(id, projectData, accessToken) {
        ProjectValidator.validateProjectUpdateRequest(id, projectData);

        if (projectData.charityId)
            await validateCharity(projectData.charityId, accessToken);

        if (projectData.categoryId)
            await validateCategory(projectData.categoryId);

        if (projectData.regionId) await validateRegion(projectData.regionId);

        const updatedProject = await ProjectRepository.update(id, projectData);
        return updatedProject
            ? new ProjectUpdateResponseDTO(updatedProject)
            : null;
    }

    async delete(id) {
        const project = await ProjectRepository.getById(id);
        if (!project || project.status !== "halted") return false;

        const result = await ProjectRepository.delete(id);
        if (result) {
            await publish({
                topic: "to_shard",
                event: "deleted_project",
                message: project,
            });
        }
        return result;
    }

    async updateStatus(id, status, reason, accessToken) {
        const project = await ProjectRepository.getById(id);
        if (!project) return false;

        if (
            (project.status === "active" && status === "halted") ||
            (project.status === "halted" && status === "active")
        ) {
            if (status === "halted") {
                const charity = await validateCharity(
                    project.charityId,
                    accessToken
                );
                const user = await validateUser(charity.userId);

                const categoryIds = project.categoryIds.map(
                    (category) => category._id
                );
                console.log(categoryIds);
                const categories = await validateCategory(categoryIds);
                const region = await validateRegion(project.regionId);

                const result = mergeNotificationLists(region, categories);
                const mergedNotificationList = result.notificationList;

                await publish({
                    topic: "to_email",
                    event: "halt_project",
                    message: {
                        charity: { name: charity.name, email: user.email },
                        project: project,
                        notificationList: [...mergedNotificationList],
                        reason,
                    },
                });
            }

            return await ProjectRepository.update(id, { status });
        }

        return false;
    }

    async activeProject(id) {
        const project = await ProjectRepository.getById(id);
        if (!project) throw new Error("No Project Found");

        if (project.status !== "pending") {
            throw new Error("Cannot activate non-pending Project");
        }

        return await ProjectRepository.update(id, "active");
    }

    async getById(id, accessToken) {
        const project = await ProjectRepository.getById(id);
        if (!project) throw new Error("Project not found");

        const charity = await validateCharity(project.charityId, accessToken);
        const categories = project.categoryIds; // Directly use the populated fields
        const region = project.regionId;

        return new ProjectResponseDTO(project, categories, region, charity);
    }

    async getAll(filters, accessToken) {
        if (filters.charityName) {
            const charityIds = await validateCharityName(
                filters.charityName,
                accessToken
            );

            if (charityIds.length > 0) {
                if (!Array.isArray(filters.charityIds)) {
                    filters.charityIds = charityIds.map(
                        (charity) => charity._id
                    );
                }
            } else {
                return {
                    total: 0,
                    page: filters.page || 1,
                    limit: filters.limit || 10,
                    projects: [],
                };
            }

            delete filters.charityName;
        }

        if (filters.categoryIds) {
            if (!Array.isArray(filters.categoryIds)) {
                filters.categoryIds = [filters.categoryIds];
            }
        }

        const { total, page, limit, projects } = await ProjectRepository.getAll(
            filters
        );
        console.log(projects);

        const verifiedCharities = new Map();

        const projectDTOs = await Promise.all(
            projects.map(async (project) => {
                let charity;

                // Check if the charity is already in the map
                if (verifiedCharities.has(project.charityId)) {
                    charity = verifiedCharities.get(project.charityId);
                } else {
                    // Fetch charity details and add them to the map
                    charity = await validateCharity(
                        project.charityId,
                        accessToken
                    );
                    verifiedCharities.set(project.charityId, charity);
                }

                const categories = project.categoryIds;
                const region = project.regionId;

                return new ProjectResponseDTO(
                    project,
                    categories,
                    region,
                    charity
                );
            })
        );

        return {
            total,
            page,
            limit,
            projects: projectDTOs, // Return the transformed projects using DTOs
        };
    }

    async getTotalProjects(filters) {
        const query = {};
        if (filters.country) query.country = filters.country;
        if (filters.continent) query.continent = filters.continent;
        if (filters.categoryId)
            query.categoryIds = { $in: [filters.categoryId] };

        const total = await ProjectRepository.countDocuments(query);
        return { total };
    }

    async getTotalProjectStatus(filters) {
        const query = {};
        if (filters.year) {
            const startDate = new Date(filters.year, 0, 1);
            const endDate = new Date(filters.year + 1, 0, 1);
            query.createdAt = { $gte: startDate, $lt: endDate };
        }
        if (filters.month) {
            const startDate = new Date(filters.year, filters.month - 1, 1);
            const endDate = new Date(filters.year, filters.month, 1);
            query.createdAt = { $gte: startDate, $lt: endDate };
        }
        if (filters.week) {
            const startDate = new Date(
                filters.year,
                filters.month - 1,
                filters.week * 7
            );
            const endDate = new Date(
                filters.year,
                filters.month - 1,
                (filters.week + 1) * 7
            );
            query.createdAt = { $gte: startDate, $lt: endDate };
        }

        return await ProjectRepository.countByStatusAndDate(query);
    }
}

module.exports = new ProjectService();
