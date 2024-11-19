const bcrypt = require('bcryptjs');
const initialData = require('../../../resources/initialData');
const charitiesData = initialData.charities;

const createCharities = async (User, Charity) => {
    try {
        // Clear existing charity data
        console.log('Clearing existing charity data...');
        await Charity.deleteMany();

        // Process each charity entry
        console.log('Creating charity accounts...');
        const charityDocs = await Promise.all(
            charitiesData.map(async (charity) => {
                // Create a user in authDB
                const charityUser = new User({
                    email: `${charity.companyName.replace(' ', '').toLowerCase()}@charitan.com`,
                    password: await bcrypt.hash('charitypassword', 10),
                    role: 'Charity', 
                    isVerified: true,
                });
                await charityUser.save();

                // Create a charity entry in charityDB
                const charityDoc = new Charity({
                    userId: charityUser._id,
                    companyName: charity.companyName,
                    address: `${charity.companyName} Address`,
                    taxCode: `TAX${Math.floor(Math.random() * 10000)}`,
                    type: charity.type,
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
