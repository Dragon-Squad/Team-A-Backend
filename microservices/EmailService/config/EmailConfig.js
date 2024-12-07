require("dotenv").config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.TMP_EMAIL,
    pass: process.env.TMP_PASS
  }
});

module.exports = transporter;
