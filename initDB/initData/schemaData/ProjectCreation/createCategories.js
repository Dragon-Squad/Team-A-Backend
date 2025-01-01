const initialData = require('../../../resources/initialData');
const categoriesData = initialData.categories;

const createCategories = async (Category) => {
    try {
      // Process each category entry
      console.log('Creating categories...');
      const categories = await Category.insertMany(categoriesData.map(name => ({ name, subscriptionList: [], notificationList: [] })));
      
      console.log('All categories created successfully.');
      return categories;  
    } catch (error) {
      console.error('Error creating categories:', error);
    }
};

module.exports = { createCategories };