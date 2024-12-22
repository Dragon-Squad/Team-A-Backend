const DonationRepository = require('./DonationRepository');
const { createDonationSession } = require('../utils/StripeUtils');

class DonationService {
    async donation(data) {
        const { email, message: personalMessage = null, projectId, monthlyDonationId, amount } = data;
        let customerId = "cus_RPk3Q0QY3NFMwo";  // Replace with dynamic customer ID if needed
        
        if (!email) throw new Error('No Email provided');
        if (!projectId) throw new Error('No Project provided');
        if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) throw new Error('Amount must be a valid positive number');
        
        const unitAmount = Math.round(amount * 100); // Convert to cents
    
        try {
            const session = await createDonationSession(customerId, monthlyDonationId, unitAmount, personalMessage, projectId);
            return { checkoutUrl: session.url };
        } catch (err) {
            throw new Error('Failed to create Stripe Checkout session: ' + err.message);
        }
    }

    async create(data){
        try{
            const result = await DonationRepository.create(data);
            return result;
        } catch (error){
            throw new Error('Error: ' + error.message);
        }
    }

    async getAllDonations(limit, page){
        try{
            const result = await DonationRepository.getAll(limit, page);
            return result;
        } catch (error){
            throw new Error('Error: ' + error.message);
        }
    }

    async getDonationById(donationId){
        try{
            if(!donationId) throw new Error('No Donation Id provided');

            const result = await DonationRepository.findById(donationId);
            return result;
        } catch (error){
            throw new Error('Error: ' + error.message);
        }
    }

    async getDonationsByDonor(limit, page, donorId){
        try{
            if(!donorId) throw new Error('No Donor Id provided');

            const result = await DonationRepository.getAllByDonor(limit, page, donorId);
            return result;
        } catch (error){
            throw new Error('Error: ' + error.message);
        }
    }

    async getDonationsByProject(limit, page, projectId){
        try{
            if(!projectId) throw new Error('No Project Id provided');

            const result = await DonationRepository.getAllByProject(limit, page, projectId);
            return result;
        } catch (error){
            throw new Error('Error: ' + error.message);
        }
    }
}

module.exports = new DonationService();