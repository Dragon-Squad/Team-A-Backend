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
                value.project._doc.title, 
                "", 
                value.project.region.name,
                value.project.categories.name, 
                value.project._doc.goalAmount.toString()
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
            value.userEmail,
            value.charity.name,
            value.project.title,
            value.project.description
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
            value.project.name,
            "",
            value.reason
        );
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
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
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
    }
}

module.exports = new EmailExternalService();
