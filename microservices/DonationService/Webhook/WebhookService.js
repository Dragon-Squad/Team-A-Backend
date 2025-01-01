require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 
const { publish } = require('../broker/Producer');
const DonationService = require("../Donation/DonationService");
const MonthlyDonationService = require('../MonthlyDonation/MonthlyDonationService');
const PaymentTransactionService = require('../PaymentTransaction/PaymentTransactionService');
const axios = require("axios");

async function handleCheckoutSessionCompleted(session, donorId, projectId, donation, selectedPaymentMethods) {
    const amount = session.amount_total / 100;
    const response = await axios.get(`http://172.30.208.1:3000/api/donors/${donorId}`);

    if (response.data && amount > 0) {
        await updateDonorStats(donorId, amount, projectId);
    }

    await createTransactionRecord(donation, amount, selectedPaymentMethods);

    const monthlyDonationId = session.metadata.monthlyDonationId;
    if (monthlyDonationId) {
        await updateMonthlyDonation(monthlyDonationId, donorId, projectId, session, amount);
    }

    await updateProjectRaisedAmount(projectId, amount);
}

async function handleCheckoutSessionExpired(session, donation, selectedPaymentMethods) {
    const amount = session.amount_total / 100;
    await createTransactionRecord(donation, amount, selectedPaymentMethods, "failed");
}

async function handleInvoicePaymentSucceeded(session, donorId, projectId, donation, selectedPaymentMethods) {
    const amount = session.amount_total / 100;
    const subscriptionId = session.subscription;

    const monthlyDonation = await MonthlyDonationService.getByStripeSubscriptionId(subscriptionId);
    if (monthlyDonation) {
        await updateMonthlyRenewDate(monthlyDonation, session);
    }

    const response = await axios.get(`http://172.30.208.1:3000/api/donors/${donorId}`);
    if (response.data && amount > 0) {
        await updateDonorStats(donorId, amount, projectId);
    }

    await createTransactionRecord(donation, amount, selectedPaymentMethods);
}

async function handleInvoicePaymentFailed(session, donation, selectedPaymentMethods) {
    const amount = session.amount_total / 100;
    await createTransactionRecord(donation, amount, selectedPaymentMethods, "failed");

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

async function createTransactionRecord(donation, amount, selectedPaymentMethods, status = "success") {
    await PaymentTransactionService.create({
        donationId: (await donation)._id,
        amount: amount,
        status: status,
        paymentProvider: selectedPaymentMethods
    });
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
        console.log("session");
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

        const allPaymentMethods = session.payment_method_types;
        const configuredMethods = Object.keys(session.payment_method_options || {});
        const selectedPaymentMethods = allPaymentMethods.find(method =>
            configuredMethods.includes(method)
        ) || "unknown";

        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutSessionCompleted(session, donorId, projectId, donation, selectedPaymentMethods);
                break;

            case 'checkout.session.expired':
                await handleCheckoutSessionExpired(session, donation, selectedPaymentMethods);
                break;

            case 'invoice.payment_succeeded':
                await handleInvoicePaymentSucceeded(session, donorId, projectId, donation, selectedPaymentMethods);
                break;
            
            case 'invoice.payment_failed':
                await handleInvoicePaymentFailed(session, donation, selectedPaymentMethods);
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    }
}

module.exports = new WebhookService();
