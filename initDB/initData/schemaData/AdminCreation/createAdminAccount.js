//createAdmin.js
const initialData = require("../../../resources/initialData");
const bcrypt = require("bcryptjs");

const adminData = initialData.admin;

const createAdminAccount = async (Admin) => {
    try {
        // Create the new admin account
        console.log("Creating admin account...");
        const admin = new Admin({
            email: adminData.email,
            hashedPassword: await bcrypt.hash(adminData.password, 10),
        });
        await admin.save();
        console.log("Admin account created successfully");
    } catch (error) {
        throw new Error("Error Creating Admin Account: " + error);
    }
};

module.exports = { createAdminAccount };
