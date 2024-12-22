const MonthlyDonationRepository = require('./MonthlyDonationRepository');
const DonationService = require('../Donation/DonationService');

class MonthlyDonationService {
  async create(data) {
    try {
      const newMonthlyDonation = await MonthlyDonationRepository.create(data);
      return newMonthlyDonation;
    } catch (error) {
      throw new Error('Error creating Monthly Donation: ' + error.message);
    }
  }

  async getAllMonthlyDonations(page, limit) {
    try {
      const result = await MonthlyDonationRepository.getAll(page, limit);
      return result;
    } catch (error) {
      throw new Error('Error fetching all Monthly Donations: ' + error.message);
    }
  }

  async getAllMonthlyDonationsByDonor(page, limit, donorId, status, sortField = 'startedDate', sortOrder = 'asc') {
    try {
      const result = await MonthlyDonationRepository.getAllByDonor(page, limit, donorId, status, sortField, sortOrder);
      return result;
    } catch (error) {
      throw new Error('Error fetching Monthly Donations by Donor: ' + error.message);
    }
  }

  async getMonthlyDonationById(id) {
    try {
      const monthlyDonation = await MonthlyDonationRepository.findById(id);
      if (!monthlyDonation) {
        throw new Error('Monthly Donation not found');
      }
      return monthlyDonation;
    } catch (error) {
      throw new Error('Error finding Monthly Donation: ' + error.message);
    }
  }

  async update(id, data) {
    try {
      const updatedMonthlyDonation = await MonthlyDonationRepository.update(id, data);
      if (!updatedMonthlyDonation) {
        throw new Error('Monthly Donation not found or failed to update');
      }
      return updatedMonthlyDonation;
    } catch (error) {
      throw new Error('Error updating Monthly Donation: ' + error.message);
    }
  }

  async cancel(id) {
    try {
      const cancelledMonthlyDonation = await MonthlyDonationRepository.cancel(id);
      if (!cancelledMonthlyDonation) {
        throw new Error('Monthly Donation not found or failed to cancel');
      }
      return cancelledMonthlyDonation;
    } catch (error) {
      throw new Error('Error cancelling Monthly Donation: ' + error.message);
    }
  }

  async autoChargeMonthlyDonations() {
    const today = new Date();
    
    const donationsToProcess = await MonthlyDonationRepository.getAllMonthlyDonationsOnRenewDate(today);
  
    for (const donation of donationsToProcess) {
      // const donor = await DonorRepository.findById(donation.donorId);
      
      const amount = donation.amount;
  
      
    }
  }
}

module.exports = new MonthlyDonationService();
