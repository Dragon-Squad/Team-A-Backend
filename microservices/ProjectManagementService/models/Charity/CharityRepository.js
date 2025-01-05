const Charity = require("./CharitySchema");

class CharityRepository {
  async searchByName(search) {
    const query = { companyName: { $regex: search, $options: "i" } };
    const charityIds = await Charity.find(query).select("_id");
    return charityIds.map((charity) => charity._id);
  }
}

module.exports = new CharityRepository();
