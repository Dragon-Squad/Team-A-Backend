const transporter = require("../config/EmailConfig");
const {
    verifyMail,
    welcomeMail,
} = require("../resources/emailTemplates");

class EmailService {
    // Send a verification email
    static async sendVerifyEmail(receiver, name, OTP) {
        const mailOptions = verifyMail(receiver, name, OTP);
        await this.sendEmail(mailOptions);
    }

    // Send a welcome email
    static async sendWelcomeEmail(receiver, name, role) {
        const mailOptions = welcomeMail(receiver, name, role);
        await this.sendEmail(mailOptions);
    }

    // Generic function to send emails
    static async sendEmail(mailOptions) {
		const info = await transporter.sendMail(mailOptions);
		console.log("Email sent:", info.response);
    }
}

module.exports = EmailService;
