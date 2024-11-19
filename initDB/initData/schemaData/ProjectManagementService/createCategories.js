const initialData = require('../../../resources/initialData');
const categoriesData = initialData.categories;

const createCategories = async (Category) => {
    try {
      // Clear existing charity data
      console.log('Clearing existing category data...');
      await Category.deleteMany();

      // Process each category entry
      console.log('Creating categories...');
      const categories = await Category.insertMany(categoriesData.map(name => ({ name })));
      
      console.log('All categories created successfully.');
      return categories;  
    } catch (error) {
      console.error('Error creating categories:', error);
    }
};

module.exports = { createCategories };