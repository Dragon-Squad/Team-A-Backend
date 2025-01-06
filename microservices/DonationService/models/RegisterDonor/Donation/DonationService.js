require('dotenv').config();
const DonationRepository = require('./DonationRepository');
const { createDonationSession } = require('../../../utils/StripeUtils');
const { publish } = require("../../../broker/Producer");
const { connectConsumer } = require("../../../broker/Consumer");
const MonthlyDonationService = require('../MonthlyDonation/MonthlyDonationService');
const axios = require("axios");
const DonationDTO = require('./DonationDTO');
const CryptoJS = require('crypto-js');
const { getDonor } = require('../../../utils/ApiUtils');

const secretKey = process.env.SECRET_KEY;

class DonationService {
    async donation(data, accessToken) {
        const { message: personalMessage = null, projectId, donationType, amount } = data;
    
        if (!projectId) throw new Error('No Project provided');
        if (!donationType) throw new Error('No Donation Type provided');
        if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) throw new Error('Amount must be a valid positive number');

        const donor = await getDonor(accessToken);
        const userId = donor.userId;
        let customerId = donor.hashedStripeId;
        const bytes = CryptoJS.AES.decrypt(customerId, secretKey);
        customerId = bytes.toString(CryptoJS.enc.Utf8);

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
    
            const session = await createDonationSession(customerId, monthlyDonationId, unitAmount, personalMessage, projectId, userId, "Donation");
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

    async getAllDonations(limit, page, accessToken){
        try{
            let result = await DonationRepository.getAll(limit, page);
            let donations = result.data;

            let dtos = [];
            for(const donation of donations){
                const response = await axios.get(
                    `http://172.30.208.1:3000/api/donors/my`,
                    {
                        credentials: "include",
                        method: "GET",
                        headers: {
                          "Content-Type": "application/json",
                          Cookie: `accessToken=${accessToken}`,
                        }
                    }
                  );
                if (!response.data) {
                    throw new Error("Error validating donor ID");
                }
                const donor = response.data;
                delete donor.hashedStripeId;

                dtos.push(new DonationDTO(donation, donor));
            }

            result = {...result, data: dtos};
            return result;
        } catch (error){
            throw new Error('Error: ' + error.message);
        }
    }

    async getDonationById(donationId, accessToken){
        try{
            if(!donationId) throw new Error('No Donation Id provided');

            let result = await DonationRepository.findById(donationId);
            const donor = await getDonor(accessToken);
            delete donor.hashedStripeId;

            result = result.toObject(); 

            return new DonationDTO(result, donor);
        } catch (error){
            throw new Error('Error: ' + error.message);
        } 
    }

    async getDonationsByDonor(limit, page, accessToken) {
        try {
            const donor = await getDonor(accessToken);
            console.log(donor.userId);
            let result = await DonationRepository.getAllByDonor(limit, page, donor.userId);
            const trimmedDonations = result.data.map(donation => {
                const donationObject = donation.toObject();
                delete donationObject.userId;
                return donationObject;
            });
            
    
            result = { ...result, donor: donor, data: trimmedDonations };
            return result;
        } catch (error) {
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