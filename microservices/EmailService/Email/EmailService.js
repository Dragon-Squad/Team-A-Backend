const transporter = require('../config/EmailConfig');
const { verifyAccountMail, welcomeMail, projectCreationMail } = require('../resources/emailTemplates');

class EmailService {
  // Send a welcome email
  sendWelcomeEmail(receiver, name, role) {
    const mailOptions = welcomeMail(receiver, name, role);
    this.sendEmail(mailOptions);
  }

  // Send a verification email
  sendVerifyEmail(receiver, OTP) {
    console.log('Service 1');
    const mailOptions = verifyAccountMail(receiver, OTP);
    console.log('Service 2');
    this.sendEmail(mailOptions);
    console.log('Service 3');
  }

  // Send project creation email
  sendProjectCreationEmail(receiver, projectTitle) {
    const mailOptions = projectCreationMail(receiver, projectTitle);
    this.sendEmail(mailOptions);
  }

  // Generic function to send the email and handle errors
  sendEmail(mailOptions) {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  }
}

module.exports = new EmailService();
