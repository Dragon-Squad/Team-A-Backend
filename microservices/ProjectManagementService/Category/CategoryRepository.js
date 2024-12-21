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

  async getAll(limit, page){
    const totalCount = await Category.countDocuments();  
    const totalPages = Math.ceil(totalCount / limit);     
    const currentPage = page;                             
    const isLast = currentPage >= totalPages;            

    const offset = (page - 1) * limit;
    const data = await Category.find()
        .skip(offset)
        .limit(limit);

    return {
        meta: {       
        totalPages: totalPages,          
        currentPage: currentPage,        
        pageSize: limit,                
        isLast: isLast                   
        },
        data: data                         
    };
  }

  async findById(id){
    return await Category.findById(id);
  }
}

module.exports = new CategoryRepository();
