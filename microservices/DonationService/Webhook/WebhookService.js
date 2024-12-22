require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 
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
                console.log('Payment was successful:', session);
                // const donor = await donorRepository.findByStripeId(session.customer);
                // //TODO: there is 2 cases where donor is not found, or donor is a guest 
                // if (donor) {
                //     await donorRepository.update(donor.id, { totalDonation: donor.totalDonation + session.amount_total });
                // } else {
                //     //TODO: Handle logic here
                // }

                transaction = PaymentTransactionService.create({
                    donationId: (await donation)._id,
                    amount: session.amount_total/100,
                    status: "success",
                    paymentProvider: selectedPaymentMethods
                });

                // const paymentType = session.metadata.paymentType;
                // if (paymentType & paymentType === "monthly"){
                //     const monthlyDonationId = session.metadata.monthlyDonationId;

                //     try{
                //         await MonthlyDonationService.getMonthlyDonationById(monthlyDonationId);
                        
                //         const currentDate = new Date();
                //         let nextRenewalDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 15); 
                  
                //         const updatedDonation = await MonthlyDonationService.update(monthlyDonationId, {
                //           renewDate: nextRenewalDate
                //         });
                  
                //         console.log('Successfully updated the renewDate for Monthly Donation:', updatedDonation);
                //     } catch(err){
                //         throw new Error('Failed to update renew date: ' + err.message);
                //     }
                // }
                
                // await projectRepository.update(project.id, { raisedAmount: project.raisedAmount + session.amount_total });
                // break;

            case 'checkout.session.expired':
                transaction = PaymentTransactionService.create({
                    donationId: (await donation)._id,
                    amount: session.amount_total/100,
                    status: "failed",
                    paymentProvider: selectedPaymentMethods
                });

            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    }
}

module.exports = new WebhookService();