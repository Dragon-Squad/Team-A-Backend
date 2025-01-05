const GuestDonorRepository = require("./GuestDonorRepository");

class GuestDonorService {
  async create(guestDonorData) {
    try{
        const guestDonor = await GuestDonorRepository.create(guestDonorData);
        return guestDonor;
    } catch(error){
        throw new Error(error.message);
    }
  }

  async findById(guestDonorId) {
    try{
        const guestDonor = await GuestDonorRepository.findById(guestDonorId);
        return guestDonor;
    } catch(error){
        throw new Error(error.message);
    }
  }

  async findStripeIdByGuestDonorId(guestDonorId) {
    try{
        const stripeId = await GuestDonorRepository.findStripeIdByGuestDonorId(guestDonorId)
        return stripeId;
    } catch(error){
        throw new Error(error.message);
    }
  }
}

module.exports = new GuestDonorService(); 