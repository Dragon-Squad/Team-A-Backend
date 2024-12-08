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
    async sendVerifyEmail(receiver, name, OTP) {
        const mailOptions = verifyMail(receiver, name, OTP);
        await EmailService.sendEmail(mailOptions);
    }

    // Send a welcome email
    async sendWelcomeEmail(receiver, name, role) {
        const mailOptions = welcomeMail(receiver, name, role);
        await EmailService.sendEmail(mailOptions);
    }

    // Send an email for successful donation
    async sendDonorDonationSuccessEmail(
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
        await EmailService.sendEmail(mailOptions);
    }

    // Send donors an email for new project
    async sendDonorProjectCreatedEmail(
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
        await EmailService.sendEmail(mailOptions);
    }

    // Send donors an email for halted project
    async sendDonorProjectHaltedEmail(
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
        await EmailService.sendEmail(mailOptions);
    }

    // Send charity an email on project creation
    async sendCharityProjectCreatedEmail(
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
        await EmailService.sendEmail(mailOptions);
    }

    // Send charity an email on project halt
    async sendCharityProjectHaltedEmail(
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
        await EmailService.sendEmail(mailOptions);
    }

    // Send charity an email on project completion
    async sendCharityProjectCompletedEmail(
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
        await EmailService.sendEmail(mailOptions);
    }

    // Generic function to send emails
    static async sendEmail(mailOptions) {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
    }
}

module.exports = new EmailService();
