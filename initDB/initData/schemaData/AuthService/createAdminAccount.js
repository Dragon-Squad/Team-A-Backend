//createAdmin.js
const initialData = require('../../../resources/initialData');
const bcrypt = require('bcryptjs');

const adminData = initialData.admin;

const createAdminAccount = async (User) => {
    try {
      // Clear existing admin data
      console.log('Clearing existing admin data...');
      await User.deleteMany();
  
      // Create the new admin account
      console.log('Creating admin account...');
      const admin = new User({
        email: adminData.email,
        password: await bcrypt.hash(adminData.password, 10),
        role: adminData.role,
        isVerified: true,
      });
      await admin.save();
      console.log('Admin account created successfully');
    } catch (error) {
      throw new Error('Error Creating Admin Account: ' + error);
    }
  };

module.exports = { createAdminAccount };
