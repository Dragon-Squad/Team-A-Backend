require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 
const { publish } = require('../broker/Producer');
const DonationService = require("../Donation/DonationService");
const MonthlyDonationService = require('../MonthlyDonation/MonthlyDonationService');
const PaymentTransactionService = require('../PaymentTransaction/PaymentTransactionService');

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
        let transaction;
        const session = event.data.object;

        const projectId = session.metadata.projectId;
        const message = session.metadata.personal_message;
        const donationType = session.mode === "payment" ? "one-time" : "monthly";

        const donation = DonationService.create({
            projectId: projectId,
            donationType: donationType,
            message: message
        });

        const allPaymentMethods = session.payment_method_types; // Available methods
        const configuredMethods = Object.keys(session.payment_method_options || {}); // Configured methods
    
        const selectedPaymentMethods = allPaymentMethods.find(method =>
            configuredMethods.includes(method)
        ) || "unknown";

        switch (event.type) {
            case 'checkout.session.completed':
                const amount = session.amount_total/100;
                const response = await axios.get(`http://localhost:3000/api/donors/${session.metadata.donorId}`);
            
                //TODO: there is 2 cases where donor is not found, or donor is a guest 
                if (response.data) {
                    const body = {donationAmount: amount, projectId: projectId};
                    await axios.get(`http://localhost:3000/api/donors/${session.metadata.donorId}/update-stats`, body);
                } 

                transaction = PaymentTransactionService.create({
                    donationId: (await donation)._id,
                    amount: amount,
                    status: "success",
                    paymentProvider: selectedPaymentMethods
                });

                const monthlyDonationId = session.metadata.monthlyDonationId;
                if(monthlyDonationId){
                    try{
                        const monthlyDonation = await MonthlyDonationService.getMonthlyDonationById(monthlyDonationId);
                        
                        const updatedMonthlyDonation = {
                            donorId: session.customer,
                            projectId: projectId,
                            stripeSubscriptionId: session.subscription,
                            amount: session.metadata.amount,
                            renewDate: session.metadata.renewDate,
                            cancelledAt: null,
                            isActive: true,
                        };

                        await MonthlyDonationService.update(monthlyDonationId,updatedMonthlyDonation);
                    
                    } catch(err){
                        throw new Error('Failed to update renew date: ' + err.message);
                    }
                }
                
                await publish({
                    topic: "donation_to_project",
                    event: "update_project",
                    message: {
                        projectId: projectId,
                        amount: amount,
                    },
                });

                // await publish({
                //     topic: "donation_to_email",
                //     event: "donation_success",
                //     message: {
                //         donor: donor,
                //         donation: donation,
                //         transaction: transaction,
                //     },
                // });

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