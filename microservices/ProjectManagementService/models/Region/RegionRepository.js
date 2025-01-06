const Region = require("./RegionSchema");

class RegionRepository {
  async push(id, object, destination) {
    try {
      const updatedRegion = await Region.findByIdAndUpdate(
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
      const updatedRegion = await Region.findByIdAndUpdate(
        id, 
        { $pull: { [destination]: object } }, 
        { new: true } 
      );

      return updatedRegion;
    } catch (error) {
      console.error(`Error popping from ${destination}:`, error);
      throw new Error('Failed to pop from the list');
    }
  }

  async findById(id){
    return await Region.findById(id);
  }

  async getAll() {
    const regions = await Region.find()
    return regions;
  }
}

module.exports = new RegionRepository();
