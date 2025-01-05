const Category = require("./CategorySchema");

class CategoryRepository {
  async push(id, object, destination) {
    try {
      const updatedCategory = await Category.findByIdAndUpdate(
        id, 
        { $push: { [destination]: object } }, 
        { new: true } 
      );

      return true;
    } catch (error) {
      console.error(`Error pushing to ${destination}:`, error);
      throw new Error('Failed to push to the list');
    }
  }

  async pull(id, object, destination) {
    try {
      const updatedCategory = await Category.findByIdAndUpdate(
        id, 
        { $pull: { [destination]: object } }, 
        { new: true } 
      );

      return updatedCategory;
    } catch (error) {
      console.error(`Error popping from ${destination}:`, error);
      throw new Error('Failed to pop from the list');
    }
  }

  async findById(id){
    return await Category.findById(id);
  }
}

module.exports = new CategoryRepository();
