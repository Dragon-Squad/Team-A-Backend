class TotalDonationDTO{
    constructor(projects){
        this.totalDonations = 0;
        for(const project of projects){
            this.totalDonations += project.raisedAmount;
        }
    }
}

class CharityProjectsDTO{
    constructor(projects){
        this.totalDonations = 0;
        this.totalProjects = projects.length;
        for(const project of projects){
            this.totalDonations += project.raisedAmount;
        }
    }
}

class CompareDonationDTO {
    constructor(firstCategoryProjects, secondCategoryProjects, firstRegionsProjects, secondRegionsProjects, names) {
        // Initialize category and region data structures
        let firstCategory = { 
            name: names[0], 
            donatedValue: 0, 
            projectCount: firstCategoryProjects.length
        };
        let secondCategory = { 
            name: names[1], 
            donatedValue: 0, 
            projectCount: secondCategoryProjects.length
        };
        let firstRegion = { 
            name: names[2], 
            donatedValue: 0, 
            projectCount: firstRegionsProjects.length
        };
        let secondRegion = { 
            name: names[3], 
            donatedValue: 0, 
            projectCount: secondRegionsProjects.length
        };

        // Summing up donations by category and region
        for (const project of firstCategoryProjects) {
            firstCategory.donatedValue += project.raisedAmount;
        }

        for (const project of secondCategoryProjects) {
            secondCategory.donatedValue += project.raisedAmount;
        }

        for (const project of firstRegionsProjects) {
            firstRegion.donatedValue += project.raisedAmount;
        }

        for (const project of secondRegionsProjects) {
            secondRegion.donatedValue += project.raisedAmount;
        }

        // Storing categories and regions comparison data
        this.categories = [firstCategory, secondCategory];
        this.continents = [firstRegion, secondRegion];
    }
}

module.exports = { TotalDonationDTO, CompareDonationDTO, CharityProjectsDTO };
