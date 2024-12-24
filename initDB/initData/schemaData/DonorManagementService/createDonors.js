const bcrypt = require('bcryptjs');
const { faker } = require ('@faker-js/faker');

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
                email: email,
                hashedPassword: await bcrypt.hash('donorpassword', 10),
                isActive: true
            });
            await donorUser.save();

            const donor = new Donor({
                userId: donorUser._id,
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
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
