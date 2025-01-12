const { publish } = require('../broker/Producer');
const { connectConsumer } = require('../broker/Consumer');
const DonationService = require("../models/RegisterDonor/Donation/DonationService");
const MonthlyDonationService = require('../models/RegisterDonor/MonthlyDonation/MonthlyDonationService');
const PaymentTransactionService = require('../models/PaymentTransaction/PaymentTransactionService');
const axios = require("axios");
const GuestDonationService = require('../models/GuestDonor/GuestDonation/GuestDonationService');

function getDataFromSession(session){
    const amount = session.amount_total / 100;
    const projectId = session.metadata.projectId;
    const message = session.metadata.personal_message;
    const donationType = session.mode === "payment" ? "one-time" : "monthly";
    const donorType = session.metadata.donorType;
    const userId = session.metadata.userId;
    const userEmail = session.metadata.userEmail;

    const allPaymentMethods = session.payment_method_types;
    const configuredMethods = Object.keys(session.payment_method_options || {});
    const selectedPaymentMethods = allPaymentMethods.find(method =>
        configuredMethods.includes(method)
    ) || "unknown";

    return {amount, projectId, message, donationType, donorType, userId, userEmail, selectedPaymentMethods};
}

async function handleCheckoutSessionCompleted(session) {
    const {amount, projectId, message, donationType, donorType, userId, userEmail, selectedPaymentMethods} = getDataFromSession(session);

    if(donorType === "Donation" && amount > 0){
        await updateDonorStats(userId, amount, projectId);
    } 

    const transaction = await createTransactionRecord(amount, selectedPaymentMethods, "success");

    let donation;
    if(donorType == "Donation"){
        donation = await DonationService.create({
            transactionId: (await transaction)._id,
            projectId: projectId,
            userId: userId,
            donationType: donationType,
            message: message
        });
    } else {
        donation = await GuestDonationService.create({
            transactionId: (await transaction)._id,
            projectId: projectId,
            guestId: userId,
            message: message
        });
    }

    const monthlyDonationId = session.metadata.monthlyDonationId;
    const monthlyAmount = session.metadata.monthlyAmount;
    if (monthlyDonationId) {
        await updateMonthlyDonation(monthlyDonationId, userId, projectId, session, monthlyAmount);
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
                        clearTimeout(timer);

                        await publish({
                            topic: "to_email",
                            event: "donation_success",
                            message: {
                                userEmail: userEmail,
                                projectTitle: value.project.title,
                                projectUrl: "",
                                amount: amount,
                            },
                        });

                        resolve();
                    }
                }
            });
        });
    } catch (err) {
        console.error('Error during donation process:', err.message);
        throw err;
    } finally {
        await consumer.disconnect();
    }

    await updateProjectRaisedAmount(projectId, amount);
}

async function handleCheckoutSessionExpired(session) {
    const {amount, projectId, message, donationType, donorType, userId, selectedPaymentMethods} = getDataFromSession(session);
    const transaction = await createTransactionRecord(amount, selectedPaymentMethods, "failed");

    let donation;
    if(donorType == "Donation"){
        donation = await DonationService.create({
            transactionId: (await transaction)._id,
            projectId: projectId,
            userId: userId,
            donationType: donationType,
            message: message
        });
    } else {
        donation = await GuestDonationService.create({
            transactionId: (await transaction)._id,
            projectId: projectId,
            guestId: userId,
            message: message
        });
    }
}

async function handleInvoicePaymentSucceeded(session) {
    const {amount, projectId, message, donationType, donorType, userId, selectedPaymentMethods} = getDataFromSession(session);
    const subscriptionId = session.subscription;

    const monthlyDonation = await MonthlyDonationService.getByStripeSubscriptionId(subscriptionId);
    if (monthlyDonation) {
        await updateMonthlyRenewDate(monthlyDonation, session);
    }

    if (amount > 0) {
        await updateDonorStats(userId, amount, projectId);
    }

    const transaction = await createTransactionRecord(amount, selectedPaymentMethods, "failed");

    let donation;
    if(donorType == "Donation"){
        donation = await DonationService.create({
            transactionId: (await transaction)._id,
            projectId: projectId,
            userId: userId,
            donationType: donationType,
            message: message
        });
    } else {
        donation = await GuestDonationService.create({
            transactionId: (await transaction)._id,
            projectId: projectId,
            guestId: userId,
            message: message
        });
    }
}

async function handleInvoicePaymentFailed(session) {
    const {amount, projectId, message, donationType, donorType, userId, selectedPaymentMethods} = getDataFromSession(session);
    const transaction = await createTransactionRecord(amount, selectedPaymentMethods, "failed");

    let donation;
    if(donorType == "Donation"){
        donation = await DonationService.create({
            transactionId: (await transaction)._id,
            projectId: projectId,
            userId: userId,
            donationType: donationType,
            message: message
        });
    } else {
        donation = await GuestDonationService.create({
            transactionId: (await transaction)._id,
            projectId: projectId,
            guestId: userId,
            message: message
        });
    }

    const subscriptionId = session.subscription;

    const monthlyDonation = await MonthlyDonationService.getByStripeSubscriptionId(subscriptionId);
    if (monthlyDonation) {
        await MonthlyDonationService.cancel(monthlyDonation._id);
    }
}

async function updateDonorStats(userId, amount, projectId) {
    const body = { donationAmount: amount, projectId: projectId };
    await axios.post(`https://team-b-backend.tail8c88ab.ts.net:3000/api/donors/${userId}/update-stats`, body);
}

async function createTransactionRecord(amount, selectedPaymentMethods, status) {
    const paymentTransaction = await PaymentTransactionService.create({
                                        amount: amount,
                                        status: status,
                                        paymentProvider: selectedPaymentMethods,
                                    });
    console.log("transaction created");
    return paymentTransaction;
}

async function updateMonthlyDonation(monthlyDonationId, userId, projectId, session, amount) {
    try {
        const monthlyDonation = await MonthlyDonationService.getMonthlyDonationById(monthlyDonationId);
        const updatedMonthlyDonation = {
            userId: userId,
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

module.exports = { handleCheckoutSessionCompleted, handleCheckoutSessionExpired, handleInvoicePaymentSucceeded, handleInvoicePaymentFailed };