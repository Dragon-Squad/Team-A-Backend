const bcrypt = require('bcryptjs');
const initialData = require('../../../resources/initialData');

const createDonors= async (User, Donor) => {
    try {
        // Clear existing charity data
        console.log('Clearing existing donor data...');
        await Donor.deleteMany();

        // Process each charity entry
        console.log('Creating donor accounts...');
        const donors = [];

        for (let i = 0; i < 30; i++) {
            const donorUser = new User({
                email: `donor${i}@gmail.com`,
                password: await bcrypt.hash('donorpassword', 10),
                role: 'Donor',
                isVerified: true,
            });
            await donorUser.save();

            const donor = new Donor({
                userId: donorUser._id,
                firstName: `First${i}`,
                lastName: `Last${i}`,
                address: `Address ${i}`,
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
