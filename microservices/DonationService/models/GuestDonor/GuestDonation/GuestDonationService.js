const GuestDonationRepository = require("./GuestDonationRepository");
const GuestDonorService = require("../GuestDonor/GuestDonorService");
const { publish } = require("../../../broker/Producer");
const { connectConsumer } = require("../../../broker/Consumer");
const { createDonationSession } = require("../../../utils/StripeUtils");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const GuestDonationDTO = require("./GuestDonationDTO");

class GuestDonationService {
    async donation(data) {
        const {
            guestFirstName,
            guestLastName,
            guestEmail,
            guestAddress,
            message: personalMessage = null,
            projectId,
            amount,
        } = data;

        if (!guestFirstName && !guestLastName && !guestEmail && !guestAddress)
            throw new Error("Missing Guest Information for Donation");
        if (!projectId) throw new Error("No Project provided");
        if (typeof amount !== "number" || isNaN(amount) || amount <= 0)
            throw new Error("Amount must be a valid positive number");

        let customerId;
        try {
            // Check for existing Stripe customer
            const customers = await stripe.customers.list({
                email: guestEmail,
                limit: 1,
            });

            if (customers.data.length > 0) {
                customerId = customers.data[0].id;
            } else {
                // Create a new Stripe customer
                const newCustomer = await stripe.customers.create({
                    email: guestEmail,
                });
                customerId = newCustomer.id;
            }
        } catch (err) {
            throw new Error(
                "Failed to retrieve or create customer: " + err.message
            );
        }

        if (!customerId) {
            throw new Error("Can not create Stripe Customer");
        }

        const guestDonor = await GuestDonorService.create({
            firstName: guestFirstName,
            lastName: guestLastName,
            email: guestEmail,
            address: guestAddress,
        });

        await publish({
            topic: "to_project",
            event: "verify_project",
            message: { projectId: projectId },
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
                        const value = message.value
                            ? JSON.parse(message.value.toString())
                            : null;
                        if (value.project._id === projectId) {
                            if (value.project.status !== "active") {
                                clearTimeout(timer);
                                reject(
                                    new Error(
                                        "Non-active Project cannot be donated to"
                                    )
                                );
                            } else {
                                clearTimeout(timer);
                                resolve();
                            }
                        }
                    },
                });
            });

            const unitAmount = Math.round(amount * 100);
            const session = await createDonationSession(
                customerId,
                null,
                unitAmount,
                personalMessage,
                projectId,
                guestDonor._id.toString(),
                "GuestDonation",
                guestEmail
            );
            return { checkoutUrl: session.url };
        } catch (err) {
            console.error("Error during donation process:", err.message);
            throw err;
        } finally {
            await consumer.disconnect();
        }
    }

    async create(data) {
        try {
            const result = await GuestDonationRepository.create(data);
            return result;
        } catch (error) {
            throw new Error("Error: " + error.message);
        }
    }

    async getAllGuestDonations(limit, page) {
        try {
            let result = await GuestDonationRepository.getAll(limit, page);
            let donations = result.data;

            let dtos = [];
            for (const donation of donations) {
                const response = await GuestDonorService.findById(
                    donation.guestId
                );
                if (!response) {
                    throw new Error("No Guest Donor Found");
                }
                const donor = response;
                delete donor.hashedStripeId;

                dtos.push(new GuestDonationDTO(donation, donor));
            }

            result = { ...result, data: dtos };
            return result;
        } catch (error) {
            throw new Error("Error: " + error.message);
        }
    }

    async getGuestDonationById(donationId) {
        try {
            if (!donationId) throw new Error("No Donation Id provided");

            let result = await GuestDonationRepository.findById(donationId);
            const response = await GuestDonorService.findById(result.guestId);
            if (!response) {
                throw new Error("No Guest Donor Found");
            }
            const donor = response;
            delete donor.hashedStripeId;

            result = result.toObject();

            return new GuestDonationDTO(result, donor);
        } catch (error) {
            throw new Error("Error: " + error.message);
        }
    }

    async getGuestDonationsByProject(limit, page, projectId) {
        if (!projectId) throw new Error("No Project Id provided");

        await publish({
            topic: "to_project",
            event: "verify_project",
            message: { projectId: projectId },
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
                        const value = message.value
                            ? JSON.parse(message.value.toString())
                            : null;
                        if (value.project._id === projectId) {
                            clearTimeout(timer);
                            resolve();
                        }
                    },
                });
            });

            const guestDonations =
                await GuestDonationRepository.getAllByProject(
                    limit,
                    page,
                    projectId
                );
            return guestDonations;
        } catch (err) {
            console.error("Error during GuestDonation process:", err.message);
            throw err;
        } finally {
            await consumer.disconnect();
        }
    }
}

module.exports = new GuestDonationService();
