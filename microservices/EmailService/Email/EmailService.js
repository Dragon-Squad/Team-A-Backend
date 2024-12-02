const transporter = require("../config/EmailConfig");
const {
    verifyMail,
    welcomeMail,
    donorDonationSuccessMail,
    donorProjectCreatedMail,
    donorProjectHaltedMail,
    charityProjectCreatedMail,
    charityProjectHaltedMail,
    charityProjectCompletedMail,
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

    // Send an email for successful donation
    static async sendDonorDonationSuccessEmail(
        receiver,
        name,
        projectTitle,
        projectUrl,
        amount
    ) {
        const mailOptions = donorDonationSuccessMail(
            receiver,
            name,
            projectTitle,
            projectUrl,
            amount
        );
        await this.sendEmail(mailOptions);
    }

    // Send donors an email for new project
    static async sendDonorProjectCreatedEmail(
        receiver,
        name,
        projectTitle,
        projectUrl,
        projectRegion,
        projectCategory,
        projectDescription,
        projectGoal
    ) {
        const mailOptions = donorProjectCreatedMail(
            receiver,
            name,
            projectTitle,
            projectUrl,
            projectRegion,
            projectCategory,
            projectDescription,
            projectGoal
        );
        await this.sendEmail(mailOptions);
    }

    // Send donors an email for halted project
    static async sendDonorProjectHaltedEmail(
        receiver,
        name,
        projectTitle,
        projectUrl,
        haltReason
    ) {
        const mailOptions = donorProjectHaltedMail(
            receiver,
            name,
            projectTitle,
            projectUrl,
            haltReason
        );
        await this.sendEmail(mailOptions);
    }

    // Send charity an email on project creation
    static async sendCharityProjectCreatedEmail(
        receiver,
        name,
        projectTitle,
        projectUrl,
        projectRegion,
        projectCategory,
        projectDescription,
        projectGoal
    ) {
        const mailOptions = charityProjectCreatedMail(
            receiver,
            name,
            projectTitle,
            projectUrl,
            projectRegion,
            projectCategory,
            projectDescription,
            projectGoal
        );
        await this.sendEmail(mailOptions);
    }

    // Send charity an email on project halt
    static async sendCharityProjectHaltedEmail(
        receiver,
        name,
        projectTitle,
        projectUrl,
        haltReason
    ) {
        const mailOptions = charityProjectHaltedMail(
            receiver,
            name,
            projectTitle,
            projectUrl,
            haltReason
        );
        await this.sendEmail(mailOptions);
    }

    // Send charity an email on project completion
    static async sendCharityProjectCompletedEmail(
        receiver,
        name,
        projectTitle,
        projectUrl
    ) {
        const mailOptions = charityProjectCompletedMail(
            receiver,
            name,
            projectTitle,
            projectUrl
        );
        await this.sendEmail(mailOptions);
    }

    // Generic function to send emails
    static async sendEmail(mailOptions) {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
    }
}

module.exports = EmailService;
