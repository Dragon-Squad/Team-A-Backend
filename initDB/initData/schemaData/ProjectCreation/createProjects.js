const initialData = require("../../../resources/initialData");
const globalProjectsData = initialData.globalProjects;
const localProjectsData = initialData.localProjects;
const { uploadImage, uploadVideo } = require("../../fileData/uploadFile");

const createProjects = async (
    Project,
    charityDocs,
    categoryDocs,
    regionDocs
) => {
    try {
        // Create a map for charity lookups based on companyName
        const charityMap = charityDocs.reduce((map, charity) => {
            map[charity.name] = charity._id;
            return map;
        }, {});

        // Create maps for category and region lookups based on name
        const categoryMap = categoryDocs.reduce((map, category) => {
            map[category.name] = category._id;
            return map;
        }, {});

        const regionMap = regionDocs.reduce((map, region) => {
            map[region.name] = region._id;
            return map;
        }, {});

        const calculateEndDate = (duration) => {
            const today = new Date();
            const endDate = new Date(today);
            endDate.setMonth(today.getMonth() + duration);
            return endDate;
        };

        // Prepare global projects
        console.log("Creating global projects...");
        const globalProjects = await Promise.all(
            globalProjectsData.map(async (project) => {
                const charityId = charityMap[project.charityCompanyName];
                let categoryIds = [];
                for (const category of project.categories) {
                    categoryIds.push(categoryMap[category]);
                }
                const regionId = regionMap[project.region];

                if (!charityId || !categoryIds || !regionId) {
                    console.warn(
                        `Missing data for global project: ${project.title}`
                    );
                    return null;
                }

                const uploadPromises = project.images.map((image) =>
                    uploadImage(image, "Project", "Project/Image")
                );
                const imageUrls = await Promise.all(uploadPromises);

                let videoUrls = [];
                if (project.videos) {
                    const uploadPromises = project.videos.map((video) =>
                        uploadVideo(video, "Project")
                    );
                    videoUrls = await Promise.all(uploadPromises);
                }

                const today = new Date();

                return {
                    title: project.title,
                    description: project.description,
                    goalAmount: project.goalAmount,
                    charityId: charityId,
                    categoryIds: categoryIds,
                    regionId: regionId,
                    status: "active",
                    createdAt: today,
                    startDate: today,
                    endDate: calculateEndDate(project.duration),
                    images: imageUrls,
                    videos: videoUrls,
                };
            })
        );

        const validGlobalProjects = globalProjects.filter(
            (project) => project !== null
        );

        if (validGlobalProjects.length > 0) {
            await Project.insertMany(validGlobalProjects);
        } else {
            console.log("No valid global projects to insert.");
        }
        console.log("All global projects created successfully.");

        // Prepare local projects
        console.log("Creating local projects...");
        const localProjects = await Promise.all(
            localProjectsData.map(async (project) => {
                const charityId = charityMap[project.charityCompanyName];
                let categoryIds = [];
                for (const category of project.categories) {
                    categoryIds.push(categoryMap[category]);
                }
                const regionId = regionMap[project.region];

                if (!charityId || !categoryIds || !regionId) {
                    console.warn(
                        `Missing data for local project: ${project.title}`
                    );
                    return null;
                }

                const uploadPromises = project.images.map((image) =>
                    uploadImage(image, "Project", "Project/Image")
                );
                const imageUrls = await Promise.all(uploadPromises);

                const today = new Date();

                return {
                    title: project.title,
                    description: project.description,
                    goalAmount: project.goalAmount,
                    charityId: charityId,
                    categoryIds: categoryIds,
                    regionId: regionId,
                    status: "pending",
                    createdAt: today,
                    startDate: today,
                    endDate: calculateEndDate(project.duration),
                    images: imageUrls,
                    country: project.country,
                };
            })
        );

        const validLocalProjects = localProjects.filter(
            (project) => project !== null
        );

        if (validLocalProjects.length > 0) {
            await Project.insertMany(validLocalProjects);
        } else {
            console.log("No valid local projects to insert.");
        }
        console.log("All local projects created successfully.");
    } catch (error) {
        console.error("Error creating projects:", error);
        throw new Error("Error creating projects: " + error.message);
    }
};

module.exports = { createProjects };
