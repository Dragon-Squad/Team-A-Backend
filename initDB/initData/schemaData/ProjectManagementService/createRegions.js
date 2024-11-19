const initialData = require('../../../resources/initialData');
const regionsData = initialData.regions;

const createRegions = async (Region) => {
    try {
      // Clear existing charity data
      console.log('Clearing existing Region data...');
      await Region.deleteMany();

      // Process each Region entry
      console.log('Creating regions...');
      const regions = await Region.insertMany(regionsData.map(name => ({ name })));
      
      console.log('All regions created successfully.');
      return regions;  
    } catch (error) {
      console.error('Error creating regions:', error);
    }
};

module.exports = { createRegions };