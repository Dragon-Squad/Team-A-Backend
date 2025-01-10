const { publish } = require("../broker/Producer");
const { connectConsumer } = require("../broker/Consumer");
const { TotalDonationDTO, CompareDonationDTO, CharityProjectsDTO } = require("./StatisticDTO");

async function getProjects(){
    const consumer = await connectConsumer("to_stat");
    const timeout = 10000; 

    try {
        const projects = await new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                resolve([]);
            }, timeout);

            consumer.run({
                eachMessage: async ({ message }) => {
                    const value = message.value ? JSON.parse(message.value.toString()) : null;
                    
                    const key = message.key ? message.key.toString() : null; 
                    if (!key) {
                    console.error(`Missing key from topic: ${topic}`);
                    return;
                    }

                    if (key == "project_by_filter" && value.projects) {
                        clearTimeout(timer);
                        resolve(value.projects); 
                    }
                }
            });
        });
        return projects;
    } catch (err) {
        console.error('Error during donation process:', err.message);
        throw err;
    } finally {
        await consumer.disconnect();
    }
}

async function getNames(input){
    const consumer = await connectConsumer("to_stat");
    const timeout = 10000; 

    try {
        const names = await new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                resolve([]);
            }, timeout);

            consumer.run({
                eachMessage: async ({ message }) => {
                    const value = message.value ? JSON.parse(message.value.toString()) : null;
                    
                    const key = message.key ? message.key.toString() : null; 
                    if (!key) {
                    console.error(`Missing key from topic: ${topic}`);
                    return;
                    }

                    if (key == "return_names" && value) {
                        clearTimeout(timer);
                        resolve(value); 
                    }
                }
            });
        });
        return names;
    } catch (err) {
        console.error('Error during donation process:', err.message);
        throw err;
    } finally {
        await consumer.disconnect();
    }
}

class StatisticService{
    async getTotalDonation(country, region, category) {
        try {
            const filters = {country: country, regionId: region, categoryId: category};
            console.log(filters);
            await publish({
                topic: "to_project",
                event: "find_projects",
                message: filters,
            });

            const projects = await getProjects(); 
            const totalDonationDto = new TotalDonationDTO(projects);
            return { totalDonations: totalDonationDto.totalDonations };
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async compareDonation(body) {
        try {
            const { categories, continents } = body;
            
            // Validation checks
            if (!categories || categories.length !== 2) {
                throw new Error("There must be 2 categoryId inputs");
            }
            if (!continents || continents.length !== 2) {
                throw new Error("There must be 2 continentId inputs");
            }
    
            // Fetch first category projects
            await publish({
                topic: "to_project",
                event: "find_projects",
                message: { categoryId: categories[0] },
            });
            const firstCategoryProjects = await getProjects();
    
            // Fetch second category projects
            await publish({
                topic: "to_project",
                event: "find_projects",
                message: { categoryId: categories[1] },
            });
            const secondCategoryProjects = await getProjects();
    
            // Fetch first region projects
            await publish({
                topic: "to_project",
                event: "find_projects",
                message: { regionId: continents[0] },
            });
            const firstRegionsProjects = await getProjects();
            
            // Fetch second region projects
            await publish({
                topic: "to_project",
                event: "find_projects",
                message: { regionId: continents[1] },
            });
            const secondRegionsProjects = await getProjects();

            // Get categories and regions names
            await publish({
                topic: "to_project",
                event: "find_names",
                message: [...categories, ...continents],
            });
            const names = await getNames();
            console.log(names);

            // Use the CompareDonationDTO to compare the data
            const compareDonationDto = new CompareDonationDTO(
                firstCategoryProjects, secondCategoryProjects,
                firstRegionsProjects, secondRegionsProjects, 
                names
            );
    
            // Return the comparison result
            return {
                categories: compareDonationDto.categories,
                continents: compareDonationDto.continents,
            };
        } catch (err) {
            throw new Error(err.message);
        }
    }
    
    async getCharityProjectStatistic(charityId) {
        try {
            if(!charityId){
                throw new Error("No charity Id provided!");
            }

            const filters = {charityIds: [charityId]};
            console.log(filters);
            await publish({
                topic: "to_project",
                event: "find_projects",
                message: filters,
            });

            const projects = await getProjects(); 
            const charityProjectsDTO = new CharityProjectsDTO(projects);
            return { charityProjectsDTO };
        } catch (err) {
            throw new Error(err.message);
        }
    }
}

module.exports = new StatisticService();