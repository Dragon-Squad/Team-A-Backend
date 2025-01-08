const initialData = require('../../../resources/initialData');
const regionsData = initialData.regions;

const createRegions = async (Region) => {
    try {
      // Process each Region entry
      console.log('Creating regions...');
      const regions = await Region.insertMany(
        regionsData.map(([name, countries]) => ({
          name,
          availableCountries: countries, 
          subscriptionList: [],
          notificationList: [],
        }))
      );
      
      console.log('All regions created successfully.');
      return regions;  
    } catch (error) {
      console.error('Error creating regions:', error);
    }
};

module.exports = { createRegions };