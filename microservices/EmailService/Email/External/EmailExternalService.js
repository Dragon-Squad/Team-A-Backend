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
    async sendDonorDonationSuccessEmail(value) {
        const mailOptions = donorDonationSuccessMail(
            value.userEmail,
            value.projectTitle,
            value.projectUrl,
            value.amount
        );
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
    }

    // Send donors an email for new project
    async sendDonorProjectCreatedEmail(value) {
        value.notificationList.forEach(async (notificationDetail) => {
            const mailOptions = donorProjectCreatedMail(
                notificationDetail.email,
                notificationDetail.name,
                value.project.title,
                "",
                value.project.region.name,
                value.project.categories.name,
                value.project.description,
                value.project.goalAmount.toString()
            );
            const info = await transporter.sendMail(mailOptions);
            console.log("Email sent:", info.response);
        });
    }

    // Send donors an email for halted project
    async sendDonorProjectHaltedEmail(value) {
        value.notificationList.forEach(async (notificationDetail) => {
            const mailOptions = donorProjectHaltedMail(
                notificationDetail.email,
                notificationDetail.name,
                value.project.title,
                "",
                value.reason
            );
            const info = await transporter.sendMail(mailOptions);
            console.log("Email sent:", info.response);
        });
    }

    // Send charity an email on project creation
    async sendCharityProjectCreatedEmail(value) {
        const mailOptions = charityProjectCreatedMail(
            value.charity.email,
            value.charity.name,
            value.project.title,
            "",
            value.project.region.name,
            value.project.categories.name,
            value.project.description,
            value.project.goalAmount.toString()
        );
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
    }

    // Send charity an email on project halt
    async sendCharityProjectHaltedEmail(value) {
        console.log(value);
        const mailOptions = charityProjectHaltedMail(
            value.charity.email,
            value.charity.name,
            value.project.title,
            "",
            value.reason
        );
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
    }

    // Send charity an email on project completion
    async sendCharityProjectCompletedEmail(value) {
        const mailOptions = charityProjectCompletedMail(
            value.userEmail,
            value.charity.name,
            value.project.title
        );
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
    }
}

module.exports = new EmailExternalService();
