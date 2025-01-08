class DonationDTO {
    constructor(donation, donor) {
        this._id = donation._id;
        this.projectId = donation.projectId;
        this.transaction = donation.transactionId;
        this.donationType = donation.donationType;
        this.message = donation.message;
        this.createAt = donation.createdAt
        this.donor = donor;
    }
}

module.exports = DonationDTO;