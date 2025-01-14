const initialData = require('../../../resources/initialData');
const globalProjectsData = initialData.globalProjects;
const localProjectsData = initialData.localProjects;
const { uploadImage } = require('../../fileData/uploadFile');

const createProjects = async (Project, charityDocs, categoryDocs, regionDocs) => {
    try {
        // Prepare global projects
        console.log('Creating global projects...');
        const globalProjects = globalProjectsData.map(async (project) => {
            let imageUrls = [];
            const uploadPromises = project.images.map(image => uploadImage(image, "Project"));
            imageUrls = await Promise.all(uploadPromises);

            console.log(`${project.title} : ${imageUrls.length}`);
        });

        console.log('Creating local projects...');
        const localProjects = localProjectsData.map(async (project) => {
            let imageUrls = [];
            const uploadPromises = project.images.map(image => uploadImage(image, "Project"));
            imageUrls = await Promise.all(uploadPromises);

            console.log(`${project.title} : ${imageUrls.length}`);
        });
    } catch (error) {
        console.error('Error creating projects:', error);
        throw new Error('Error creating projects: ' + error.message);
    }
};

createProjects();

module.exports = { createProjects };