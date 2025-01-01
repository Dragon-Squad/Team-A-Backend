require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 
const { publish } = require('../broker/Producer');
const DonationService = require("../Donation/DonationService");
const MonthlyDonationService = require('../MonthlyDonation/MonthlyDonationService');
const PaymentTransactionService = require('../PaymentTransaction/PaymentTransactionService');
const axios = require("axios");

class WebhookService {
    verifyEvent(payload, signature) {
        try {
            return stripe.webhooks.constructEvent(
                payload, 
                signature,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            throw new Error(`Webhook signature verification failed: ${err.message}`);
        }
    }

    async handleEvent(event) {
        console.log("session");
        let transaction;
        const session = event.data.object;

        const projectId = session.metadata.projectId;
        const message = session.metadata.personal_message;
        const donationType = session.mode === "payment" ? "one-time" : "monthly";
        const donorId = session.metadata.donorId;
        console.log("=========metadata=========");
        console.log(projectId);
        console.log(donationType);

        const donation = await DonationService.create({
            projectId: projectId,
            donorId: donorId,
            donationType: donationType,
            message: message
        });
        console.log(`Donation: ${donation}`);

        const allPaymentMethods = session.payment_method_types; // Available methods
        const configuredMethods = Object.keys(session.payment_method_options || {}); // Configured methods
    
        const selectedPaymentMethods = allPaymentMethods.find(method =>
            configuredMethods.includes(method)
        ) || "unknown";

        switch (event.type) {
            case 'checkout.session.completed':
                const amount = session.amount_total/100;
                const response = await axios.get(`http://172.30.208.1:3000/api/donors/${donorId}`);
    
                //If there is donor -> update donor statistic and send the email 
                if (response.data & amount > 0) {
                    const body = {donationAmount: amount, projectId: projectId};
                    await axios.post(`http://172.30.208.1:3000/api/donors/${donorId}/update-stats`, body);

                    // await publish({
                    //     topic: "donation_to_email",
                    //     event: "donation_success",
                    //     message: {
                    //         donor: donor,
                    //         donation: donation,
                    //         transaction: transaction,
                    //     },
                    // });
                } 

                //create transaction record
                transaction = PaymentTransactionService.create({
                    donationId: (await donation)._id,
                    amount: amount,
                    status: "success",
                    paymentProvider: selectedPaymentMethods
                });

                //if it is monthly, create monthly donation record
                const monthlyDonationId = session.metadata.monthlyDonationId;
                console.log(monthlyDonationId);
                if(monthlyDonationId){
                    try{
                        const monthlyDonation = await MonthlyDonationService.getMonthlyDonationById(monthlyDonationId);
                        
                        const updatedMonthlyDonation = {
                            donorId: donorId,
                            projectId: projectId,
                            stripeSubscriptionId: session.subscription,
                            amount: amount,
                            renewDate: session.metadata.renewDate,
                            cancelledAt: null,
                            isActive: true,
                        };
                        console.log(updatedMonthlyDonation);

                        await MonthlyDonationService.update(monthlyDonationId,updatedMonthlyDonation);
                    
                    } catch(err){
                        throw new Error('Failed to update renew date: ' + err.message);
                    }
                }
                
                //update the project raised amount
                await publish({
                    topic: "donation_to_project",
                    event: "update_project",
                    message: {
                        projectId: projectId,
                        amount: amount,
                    },
                });

                break;

            case 'checkout.session.expired':
                transaction = PaymentTransactionService.create({
                    donationId: (await donation)._id,
                    amount: session.amount_total/100,
                    status: "failed",
                    paymentProvider: selectedPaymentMethods
                });
                break;
            
            case 'invoice.payment_succeeded':
                const subscriptionId = session.subscription;
                
                // Retrieve the monthly donation document
                const monthlyDonation = await MonthlyDonationService.getByStripeSubscriptionId(subscriptionId);
            
                if (!monthlyDonation) {
                    console.error(`No monthly donation found for subscription ID: ${subscriptionId}`);
                    return;
                }
            
                const currentRenewDate = monthlyDonation.renewDate || new Date();
                const nextRenewDate = new Date(currentRenewDate.getFullYear(), currentRenewDate.getMonth() + 1, 15);
            
                monthlyDonation.renewDate = nextRenewDate;
                await MonthlyDonationService.update(monthlyDonation._id, monthlyDonation);
                break;
            
            case 'invoice.payment_failed':
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    }
}

module.exports = new WebhookService();