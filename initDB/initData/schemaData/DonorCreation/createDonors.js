require('dotenv').config();
const bcrypt = require('bcryptjs');
const { faker } = require ('@faker-js/faker');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const CryptoJS = require('crypto-js');

const secretKey = process.env.SECRET_KEY;

const createDonors= async (User, Donor, Address) => {
    try {
        // Process each charity entry
        console.log('Creating donor accounts...');
        const donors = [];

        for (let i = 0; i < 30; i++) {
            const countries = ['Vietnam', 'Germany', 'Qatar', 'USA', 'Cameroon'];
            const address = new Address({
                country: countries[i%5],
            });
            await address.save();

            const email = faker.internet.email({provider: 'gmail.com'});

            const donorUser = new User({
                username: email,
                email: email,
                hashedPassword: await bcrypt.hash('donorpassword', 10),
                isActive: true,
                role: "Donor",
            });
            await donorUser.save();

            let customerId;
            try {
                // Check for existing Stripe customer
                const customers = await stripe.customers.list({
                    email: email,
                    limit: 1,
                });

                if (customers.data.length > 0) {
                    customerId = customers.data[0].id;
                } else {
                    // Create a new Stripe customer
                    const newCustomer = await stripe.customers.create({
                        email: email,
                    });
                    customerId = newCustomer.id;
                }
            } catch (err) {
                throw new Error('Failed to retrieve or create customer: ' + err.message);
            }

            if (!customerId){
                throw new Error("Can not create Stripe Customer");
            }

            const donor = new Donor({
                userId: donorUser._id,
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                hashedStripeId: customerId,
            });
            donors.push(await donor.save());
        }
        console.log('All donor accounts created successfully.');
    } catch (error) {
        console.error('Error creating donor accounts:', error);
        throw new Error('Error creating donor accounts: ' + error);
    }
};

module.exports = { createDonors };
