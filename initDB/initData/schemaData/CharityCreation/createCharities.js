const bcrypt = require('bcryptjs');
const initialData = require('../../../resources/initialData');
const charitiesData = initialData.charities;
const { faker } = require ('@faker-js/faker');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { uploadImage } = require('../../fileData/uploadFile');

const createCharities = async (User, Charity, Address) => {
    try {
        // Process each charity entry
        console.log('Creating charity accounts...');
        const charityDocs = await Promise.all(
            charitiesData.map(async (charity) => {
                const address = new Address({
                    street: faker.location.street(),
                    city: faker.location.city(),
                    state: faker.location.state(),
                    zipCode: faker.location.zipCode(),
                    country: faker.location.country(),
                    continent: faker.location.continent()
                });
                await address.save();

                const email = `${charity.companyName.replace(' ', '').toLowerCase()}@charitan.com`;
                const imageUrl = await uploadImage(charity.avatar, "Charity", "Charity");

                // Create a user in authDB
                const charityUser = new User({
                    email: email,
                    hashedPassword: await bcrypt.hash('charitypassword', 10),
                    isActive: true, 
                    avatar: imageUrl,
                });
                await charityUser.save();

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

                // Create a charity entry in charityDB
                const charityDoc = new Charity({
                    userId: charityUser._id,
                    name: charity.companyName,
                    taxCode: `TAX${Math.floor(Math.random() * 10000)}`,
                    type: charity.type,
                    address: address._id,
                    region: charity.regions,
                    category: charity.category,
                    hashedStripeId: await bcrypt.hash(customerId, 10),
                });
                await charityDoc.save();
                return charityDoc;
            })
        );

        console.log('All charity accounts created successfully.');
        return charityDocs;
    } catch (error) {
        console.error('Error creating charity accounts:', error);
        throw new Error('Error creating charity accounts: ' + error);
    }
};

module.exports = { createCharities };
