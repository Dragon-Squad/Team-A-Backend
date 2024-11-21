const bcrypt = require('bcryptjs');

const createDonors= async (User, Donor, Address) => {
    try {
        // Clear existing charity data
        console.log('Clearing existing donor data...');
        await Donor.deleteMany();

        // Process each charity entry
        console.log('Creating donor accounts...');
        const donors = [];

        for (let i = 0; i < 30; i++) {
            const address = new Address({
                street: `Address ${i}`,
            });
            await address.save();

            const donorUser = new User({
                email: `donor${i}@gmail.com`,
                hashedPassword: await bcrypt.hash('donorpassword', 10),
                role: 'Donor',
                address: address._id
            });
            await donorUser.save();

            const donor = new Donor({
                userId: donorUser._id,
                firstName: `First${i}`,
                lastName: `Last${i}`,
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
