const express = require("express");
const EmailController = require("./EmailController");

const EmailRouter = express.Router();

// Emails for new users
EmailRouter.post("/verify", EmailController.sendVerifyEmail);
EmailRouter.post("/welcome", EmailController.sendWelcomeEmail);

// Emails for donors
EmailRouter.post(
    "/donor/donation-success",
    EmailController.sendDonorDonationSuccessEmail
);
EmailRouter.post(
    "/donor/project-created",
    EmailController.sendDonorProjectCreatedEmail
);
EmailRouter.post(
    "/donor/project-halted",
    EmailController.sendDonorProjectHaltedEmail
);

// // Emails for charities
// EmailRouter.post("/charity/project-created", EmailController.sendCharityProjectCreatedEmail);
// EmailRouter.post("/charity/project-halted", EmailController.sendCharityProjectHaltedEmail);
// EmailRouter.post("/charity/project-completed", EmailController.sendCharityProjectCompletedEmail);

module.exports = EmailRouter;
