const transporter = require("../../config/EmailConfig");
const {
    donorDonationSuccessMail,
    donorProjectCreatedMail,
    donorProjectHaltedMail,
    charityProjectCreatedMail,
    charityProjectHaltedMail,
    charityProjectCompletedMail,
} = require("../../resources/emailTemplates");

class EmailExternalService {
    // Send an email for successful donation
    async sendDonorDonationSuccessEmail(
        value,
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
    async sendDonorProjectCreatedEmail(value) {
        value.notificationList.forEach(async (notificationDetail) => {
            const mailOptions = donorProjectCreatedMail(
                notificationDetail.value,
                notificationDetail.name,
                "",
                value.project.region.name,
                value.project.categories.name,
                value.project.description,
                value.project.goalAmount
            );
            await EmailService.sendEmail(mailOptions);
        });
    }

    // Send donors an email for halted project
    async sendDonorProjectHaltedEmail(value) {
        value.notificationList.forEach(async (notificationDetail) => {
            const mailOptions = donorProjectHaltedMail(
                notificationDetail.value,
                notificationDetail.name,
                "",
                value.reason
            );
            await EmailService.sendEmail(mailOptions);
        });
    }

    // Send charity an email on project creation
    async sendCharityProjectCreatedEmail(value) {
        const mailOptions = charityProjectCreatedMail(
            value.charity.email,
            value.charity.name,
            value.project.name,
            "",
            value.project.region.name,
            value.project.categories.name,
            value.project.description,
            value.project.goalAmount
        );
        await EmailService.sendEmail(mailOptions);
    }

    // Send charity an email on project halt
    async sendCharityProjectHaltedEmail(value) {
        const mailOptions = charityProjectHaltedMail(
            value.charity.email,
            value.charity.name,
            value.project.name,
            "",
            value.reason
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

module.exports = new EmailExternalService();
