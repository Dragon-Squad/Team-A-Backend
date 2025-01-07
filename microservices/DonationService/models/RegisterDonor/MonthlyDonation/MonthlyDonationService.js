const MonthlyDonationRepository = require('./MonthlyDonationRepository');
const { cancelSubscription } = require("../../../utils/StripeUtils");
const { getDonor, getUser } = require('../../../utils/ApiUtils');

class MonthlyDonationService {
  async create() {
    try {
      const newMonthlyDonation = await MonthlyDonationRepository.create();
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

  async getAllMonthlyDonationsByDonor(page, limit, status, sortField = 'startedDate', sortOrder = 'asc', accessToken) {
    try {
      const donor = await getDonor(accessToken);
      const result = await MonthlyDonationRepository.getAllByDonor(page, limit, donor.userId, status, sortField, sortOrder);
      return result;
    } catch (error) {
      throw new Error('Error fetching Monthly Donations by Donor: ' + error.message);
    }
  }

  async getMonthlyDonationsByProject(limit, page, projectId){
    if(!projectId) throw new Error('No Project Id provided');

    await publish({
        topic: "donation_to_project",
        event: "verify_project",
        message: { projectId: projectId }
    });

    const consumer = await connectConsumer("project_to_donation");
    const timeout = 10000; 

    try {
        const result = await new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error("No Project Found"));
            }, timeout);

            consumer.run({
                eachMessage: async ({ message }) => {
                    const value = message.value ? JSON.parse(message.value.toString()) : null;
                    if (value.project._id === projectId) {
                        clearTimeout(timer);
                        resolve();
                    }
                }
            });
        });

        const monthlyDonations = await MonthlyDonationRepository.getAllByProject(limit, page, projectId);
        return monthlyDonations;

    } catch (err) {
        console.error('Error during monthly donation process:', err.message);
        throw err;
    } finally {
        await consumer.disconnect();
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

  async getByStripeSubscriptionId(stripeSubscriptionId) {
    try {
      const monthlyDonation = await MonthlyDonationRepository.getByStripeSubscriptionId(stripeSubscriptionId);
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
      const monthlyDonation = await MonthlyDonationRepository.findById(id);
      const stripeSubscriptionId = monthlyDonation.stripeSubscriptionId;
      console.log("Cancelling...");
      const canceledSubscription =  await cancelSubscription(stripeSubscriptionId);

      const cancelledMonthlyDonation = await MonthlyDonationRepository.cancel(id);
      if (!cancelledMonthlyDonation) {
        throw new Error('Monthly Donation not found or failed to cancel');
      }
      return cancelledMonthlyDonation;
    } catch (error) {
      throw new Error('Error cancelling Monthly Donation: ' + error.message);
    }
  }
}

module.exports = new MonthlyDonationService();
