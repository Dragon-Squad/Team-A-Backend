const GuestDonor = require("./GuestDonorSchema");

class GuestDonorRepository {
    async create(guestDonorData) {
        const guestDonor = new GuestDonor(guestDonorData);
        return await guestDonor.save();
    }

    async findById(guestDonorId) {
        const guestDonor = await GuestDonor.findById(guestDonorId);
        return guestDonor;
    }

    async findStripeIdByGuestDonorId(guestDonorId) {
        const guestDonor = await GuestDonor.findById(guestDonorId).select(
            "stripeId"
        );
        return guestDonor ? guestDonor.hashedStripeId : null;
    }
}

module.exports = new GuestDonorRepository();
