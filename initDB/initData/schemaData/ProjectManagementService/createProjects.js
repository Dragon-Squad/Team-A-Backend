const initialData = require('../../../resources/initialData');
const globalProjectsData = initialData.globalProjects;
const localProjectsData = initialData.localProjects;

const createProjects = async (Project, charityDocs, categoryDocs, regionDocs) => {
    try {
        console.log('Clearing existing project data...');
        await Project.deleteMany();

        // Create a map for charity lookups based on companyName
        const charityMap = charityDocs.reduce((map, charity) => {
            map[charity.companyName] = charity._id;
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
        console.log('Creating global projects...');
        const globalProjects = globalProjectsData.map((project) => {
            const charityId = charityMap[project.charityCompanyName];
            const categoryId = categoryMap[project.category];
            const regionId = regionMap[project.region];
            
            if (!charityId || !categoryId || !regionId) {
                console.warn(`Missing data for global project: ${project.title}`);
                return null;  
            }

            const today = new Date();

            return {
                title: project.title,
                description: project.description,
                duration: project.duration,
                goalAmount: project.goalAmount,
                charityId: charityId,
                categoryId: categoryId,
                regionId: regionId,
                status: 'active',
                createdAt: today,
                endDate: calculateEndDate(project.duration),
            };
        }).filter(project => project !== null);

        if (globalProjects.length > 0) {
            await Project.insertMany(globalProjects);
        } else {
            console.log('No valid global projects to insert.');
        }
        console.log('All global projects created successfully.');

        // Prepare local projects
        console.log('Creating local projects...');
        const localProjects = localProjectsData.map((project) => {
            const charityId = charityMap[project.charityCompanyName];
            const categoryId = categoryMap[project.category];
            const regionId = regionMap[project.region];

            if (!charityId || !categoryId || !regionId) {
                console.warn(`Missing data for local project: ${project.title}`);
                return null;  
            }

            const today = new Date();

            return {
                title: project.title,
                description: project.description,
                duration: project.duration,
                goalAmount: project.goalAmount,
                charityId: charityId,
                categoryId: categoryId,
                regionId: regionId,
                status: 'pending',
                createdAt: today,
                endDate: calculateEndDate(project.duration),
            };
        }).filter(project => project !== null);

        if (localProjects.length > 0) {
            await Project.insertMany(localProjects);
        } else {
            console.log('No valid local projects to insert.');
        }
        console.log('All local projects created successfully.');
    } catch (error) {
        console.error('Error creating projects:', error);
        throw new Error('Error creating projects: ' + error.message);
    }
};

module.exports = { createProjects };