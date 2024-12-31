const DonationRepository = require('./DonationRepository');
const { createDonationSession } = require('../utils/StripeUtils');
const { publish } = require("../broker/Producer");
const { connectConsumer } = require("../broker/Consumer");
const MonthlyDonationService = require('../MonthlyDonation/MonthlyDonationService');
const axios = require("axios");

class DonationService {
    async donation(data) {
        const { donorId, message: personalMessage = null, projectId, donationType, amount } = data;
        const customerId = "cus_RPk3Q0QY3NFMwo"; // Replace with dynamic customer ID if needed
    
        if (!donorId) throw new Error('No DonorId provided');
        if (!projectId) throw new Error('No Project provided');
        if (!donationType) throw new Error('No Donation Type provided');
        if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) throw new Error('Amount must be a valid positive number');
        
        const response = await axios.get(`http://172.30.208.1:3000/api/donors/${donorId}`);
        if (!response.data) {
            throw new Error("No Donor Found");
        }

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
                            if (value.project.status !== "active") {
                                clearTimeout(timer);
                                reject(new Error('Non-active Project cannot be donated to'));
                            } else {
                                clearTimeout(timer);
                                resolve();
                            }
                        }
                    }
                });
            });
    
            const unitAmount = Math.round(amount * 100);
            let monthlyDonationId = null;
    
            if (donationType === "monthly") {
                const monthlyDonation = await MonthlyDonationService.create();
                monthlyDonationId = monthlyDonation._id.toString();
            }
    
            const session = await createDonationSession(customerId, monthlyDonationId, unitAmount, personalMessage, projectId, donorId);
            return { checkoutUrl: session.url };
    
        } catch (err) {
            console.error('Error during donation process:', err.message);
            throw err;
        } finally {
            await consumer.disconnect();
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

            const response = await axios.get(`http://172.30.208.1:3000/api/donors/${donorId}`);
            if (!response.data) {
                throw new Error("Error validating donor ID");
            }

            const result = await DonationRepository.getAllByDonor(limit, page, donorId);
            return result;
        } catch (error){
            throw new Error('Error: ' + error.message);
        }
    }

    async getDonationsByProject(limit, page, projectId){
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
    
            const donations = await DonationRepository.getAllByProject(limit, page, projectId);
            return donations;
    
        } catch (err) {
            console.error('Error during donation process:', err.message);
            throw err;
        } finally {
            await consumer.disconnect();
        }
    }
}

module.exports = new DonationService();