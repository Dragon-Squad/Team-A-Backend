const express = require("express");
const EmailController = require("./EmailController");

const EmailRouter = express.Router();

// Emails for new users
EmailRouter.post("/verify", EmailController.sendVerifyEmail);
EmailRouter.post("/welcome", EmailController.sendWelcomeEmail);

module.exports = EmailRouter;
