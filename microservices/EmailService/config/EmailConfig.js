require("dotenv").config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "viphilongnguyen@gmail.com", 
    pass: process.env.GG_APP_PASSWORD
  }
});

module.exports = transporter;