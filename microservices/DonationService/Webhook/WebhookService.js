require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 
const { publish } = require('../broker/Producer');
const DonationService = require("../models/RegisterDonor/Donation/DonationService");
const MonthlyDonationService = require('../models/RegisterDonor/MonthlyDonation/MonthlyDonationService');
const PaymentTransactionService = require('../models/PaymentTransaction/PaymentTransactionService');
const axios = require("axios");
const GuestDonationService = require('../models/GuestDonor/GuestDonation/GuestDonationService');
const GuestDonorService = require('../models/GuestDonor/GuestDonor/GuestDonorService');

async function handleCheckoutSessionCompleted(session) {
    const amount = session.amount_total / 100;
    const projectId = session.metadata.projectId;
    const message = session.metadata.personal_message;
    const donationType = session.mode === "payment" ? "one-time" : "monthly";
    const donorId = session.metadata.donorId;
    const donorType = session.metadata.donorType;

    const allPaymentMethods = session.payment_method_types;
    const configuredMethods = Object.keys(session.payment_method_options || {});
    const selectedPaymentMethods = allPaymentMethods.find(method =>
        configuredMethods.includes(method)
    ) || "unknown";

    if(donorType === "Donation"){
        const response = await axios.get(`http://172.30.208.1:3000/api/donors/${donorId}`);

        if(!response){
            throw new Error("No Donor Found to update");
        }

        if (response.data && amount > 0) {
            await updateDonorStats(donorId, amount, projectId);
        }
    } else {
        const response = await GuestDonorService.findById(donorId);

        if(!response){
            throw new Error("No Guest Donor Found");
        }
    }

    const transaction = await createTransactionRecord(amount, selectedPaymentMethods, "success");

    let donation;
    if(donorType == "Donation"){
        donation = await DonationService.create({
            transactionId: (await transaction)._id,
            projectId: projectId,
            donorId: donorId,
            donationType: donationType,
            message: message
        });
    } else {
        donation = await GuestDonationService.create({
            transactionId: (await transaction)._id,
            projectId: projectId,
            guestId: donorId,
            message: message
        });
    }

    const monthlyDonationId = session.metadata.monthlyDonationId;
    if (monthlyDonationId) {
        await updateMonthlyDonation(monthlyDonationId, donorId, projectId, session, amount);
    }

    await updateProjectRaisedAmount(projectId, amount);
}

async function handleCheckoutSessionExpired(session) {
    const amount = session.amount_total / 100;
    const projectId = session.metadata.projectId;
    const message = session.metadata.personal_message;
    const donationType = session.mode === "payment" ? "one-time" : "monthly";
    const donorId = session.metadata.donorId;
    const donorType = session.metadata.donorType;

    const allPaymentMethods = session.payment_method_types;
    const configuredMethods = Object.keys(session.payment_method_options || {});
    const selectedPaymentMethods = allPaymentMethods.find(method =>
        configuredMethods.includes(method)
    ) || "unknown";

    const transaction = await createTransactionRecord(amount, selectedPaymentMethods, "failed");

    let donation;
    if(donorType == "Donation"){
        donation = await DonationService.create({
            transactionId: (await transaction)._id,
            projectId: projectId,
            donorId: donorId,
            donationType: donationType,
            message: message
        });
    } else {
        donation = await GuestDonationService.create({
            transactionId: (await transaction)._id,
            projectId: projectId,
            guestId: donorId,
            message: message
        });
    }
}

async function handleInvoicePaymentSucceeded(session) {
    const amount = session.amount_total / 100;
    const projectId = session.metadata.projectId;
    const message = session.metadata.personal_message;
    const donationType = session.mode === "payment" ? "one-time" : "monthly";
    const donorId = session.metadata.donorId;
    const donorType = session.metadata.donorType;

    const allPaymentMethods = session.payment_method_types;
    const configuredMethods = Object.keys(session.payment_method_options || {});
    const selectedPaymentMethods = allPaymentMethods.find(method =>
        configuredMethods.includes(method)
    ) || "unknown";
    const subscriptionId = session.subscription;

    const monthlyDonation = await MonthlyDonationService.getByStripeSubscriptionId(subscriptionId);
    if (monthlyDonation) {
        await updateMonthlyRenewDate(monthlyDonation, session);
    }

    const response = await axios.get(`http://172.30.208.1:3000/api/donors/${donorId}`);
    if (response.data && amount > 0) {
        await updateDonorStats(donorId, amount, projectId);
    }

    const transaction = await createTransactionRecord(amount, selectedPaymentMethods, "failed");

    let donation;
    if(donorType == "Donation"){
        donation = await DonationService.create({
            transactionId: (await transaction)._id,
            projectId: projectId,
            donorId: donorId,
            donationType: donationType,
            message: message
        });
    } else {
        donation = await GuestDonationService.create({
            transactionId: (await transaction)._id,
            projectId: projectId,
            guestId: donorId,
            message: message
        });
    }
}

async function handleInvoicePaymentFailed(session) {
    const amount = session.amount_total / 100;
    const projectId = session.metadata.projectId;
    const message = session.metadata.personal_message;
    const donationType = session.mode === "payment" ? "one-time" : "monthly";
    const donorId = session.metadata.donorId;
    const donorType = session.metadata.donorType;

    const allPaymentMethods = session.payment_method_types;
    const configuredMethods = Object.keys(session.payment_method_options || {});
    const selectedPaymentMethods = allPaymentMethods.find(method =>
        configuredMethods.includes(method)
    ) || "unknown";
    const transaction = await createTransactionRecord(amount, selectedPaymentMethods, "failed");

    let donation;
    if(donorType == "Donation"){
        donation = await DonationService.create({
            transactionId: (await transaction)._id,
            projectId: projectId,
            donorId: donorId,
            donationType: donationType,
            message: message
        });
    } else {
        donation = await GuestDonationService.create({
            transactionId: (await transaction)._id,
            projectId: projectId,
            guestId: donorId,
            message: message
        });
    }

    const subscriptionId = session.subscription;

    const monthlyDonation = await MonthlyDonationService.getByStripeSubscriptionId(subscriptionId);
    if (monthlyDonation) {
        await MonthlyDonationService.cancel(monthlyDonation._id);
    }
}

async function updateDonorStats(donorId, amount, projectId) {
    const body = { donationAmount: amount, projectId: projectId };
    await axios.post(`http://172.30.208.1:3000/api/donors/${donorId}/update-stats`, body);
}

async function createTransactionRecord(amount, selectedPaymentMethods, status) {
    const paymentTransaction = await PaymentTransactionService.create({
                                        amount: amount,
                                        status: status,
                                        paymentProvider: selectedPaymentMethods,
                                    });
    return paymentTransaction;
}

async function updateMonthlyDonation(monthlyDonationId, donorId, projectId, session, amount) {
    try {
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
        await MonthlyDonationService.update(monthlyDonationId, updatedMonthlyDonation);
    } catch (err) {
        throw new Error('Failed to update renew date: ' + err.message);
    }
}

async function updateMonthlyRenewDate(monthlyDonation, session) {
    const currentRenewDate = monthlyDonation.renewDate || new Date();
    const nextRenewDate = new Date(currentRenewDate.getFullYear(), currentRenewDate.getMonth() + 1, 15);
    monthlyDonation.renewDate = nextRenewDate;
    await MonthlyDonationService.update(monthlyDonation._id, monthlyDonation);
}

async function updateProjectRaisedAmount(projectId, amount) {
    await publish({
        topic: "donation_to_project",
        event: "update_project",
        message: {
            projectId: projectId,
            amount: amount,
        },
    });
}

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
        const session = event.data.object;
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutSessionCompleted(session);
                break;

            case 'checkout.session.expired':
                await handleCheckoutSessionExpired(session);
                break;

            case 'invoice.payment_succeeded':
                await handleInvoicePaymentSucceeded(session);
                break;
            
            case 'invoice.payment_failed':
                await handleInvoicePaymentFailed(session);
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    }
}

module.exports = new WebhookService();
