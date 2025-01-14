class GuestDonationDTO {
    constructor(donation, donor) {
        this._id = donation._id;
        this.projectId = donation.projectId;
        this.transaction = donation.transactionId;
        this.message = donation.message;
        this.createAt = donation.createdAt;
        this.donor = donor;
    }
}

module.exports = GuestDonationDTO;
