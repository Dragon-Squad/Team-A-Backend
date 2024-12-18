const Donation = require('./DonationSchema');

class DonationRepository {
  async create(data) {
    const donation = new Donation(data);
    return await donation.save();
  }
  
  async count() {
    return await Donation.countDocuments();
  }

  async findById(id) {
    return await Donation.findById(id);
  }

  async getAll(page, limit) {
    const offset = (page - 1) * limit;
    return await Donation.find() 
      .skip(offset)  
      .limit(limit);
  }

  async getAllByDonor(donorId, page, limit) {
    const offset = (page - 1) * limit;
    return await Donation.find({ donor: donorId })
      .skip(offset)
      .limit(limit);
  }

  async getAllByProject(projectId, page, limit) {
    const offset = (page - 1) * limit;
    return await Donation.find({ project: projectId })
      .skip(offset)
      .limit(limit);
  }

  async countByDonor(donorId) {
    return await Donation.countDocuments({ donor: donorId });
  }

  async countByProject(projectId) {
    return await Donation.countDocuments({ project: projectId });
  }
}

module.exports = new DonationRepository();