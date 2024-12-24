const bcrypt = require('bcryptjs');
const initialData = require('../../../resources/initialData');
const charitiesData = initialData.charities;
const { faker } = require ('@faker-js/faker');

const createCharities = async (User, Charity, Address, fileIds) => {
    try {
        let imageIndex = 0;

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

                // Create a user in authDB
                const charityUser = new User({
                    email: `${charity.companyName.replace(' ', '').toLowerCase()}@charitan.com`,
                    hashedPassword: await bcrypt.hash('charitypassword', 10),
                    isActive: true, 
                });
                await charityUser.save();

                // Create a charity entry in charityDB
                const charityDoc = new Charity({
                    userId: charityUser._id,
                    name: charity.companyName,
                    taxCode: `TAX${Math.floor(Math.random() * 10000)}`,
                    type: charity.type,
                    images: [fileIds[imageIndex]],
                    address: address._id,
                    region: charity.regions,
                    category: charity.category,
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
