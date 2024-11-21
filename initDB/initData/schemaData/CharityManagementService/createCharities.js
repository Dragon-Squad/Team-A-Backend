const bcrypt = require('bcryptjs');
const initialData = require('../../../resources/initialData');
const charitiesData = initialData.charities;

const createCharities = async (User, Charity, Address, fileIds) => {
    try {
        // Clear existing charity data
        console.log('Clearing existing charity data...');
        await User.deleteMany();
        await Charity.deleteMany();
        await Address.deleteMany();

        let imageIndex = 0;

        // Process each charity entry
        console.log('Creating charity accounts...');
        const charityDocs = await Promise.all(
            charitiesData.map(async (charity) => {
                const address = new Address({
                    street: `${charity.companyName} St.`,
                    country: charity.country
                });
                await address.save();

                // Create a user in authDB
                const charityUser = new User({
                    email: `${charity.companyName.replace(' ', '').toLowerCase()}@charitan.com`,
                    hashedPassword: await bcrypt.hash('charitypassword', 10),
                    role: 'Charity', 
                    address: address._id
                });
                await charityUser.save();

                // Create a charity entry in charityDB
                const charityDoc = new Charity({
                    userId: charityUser._id,
                    companyName: charity.companyName,
                    address: `${charity.companyName} Address`,
                    taxCode: `TAX${Math.floor(Math.random() * 10000)}`,
                    type: charity.type,
                    images: [fileIds[imageIndex]],
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
