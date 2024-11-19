const express = require('express');
const EmailController = require('./EmailController');

const EmailRouter = express.Router();

// Route for sending welcome email
EmailRouter.post('/welcome-email', EmailController.sendWelcomeEmail);

// Route for sending verification email
EmailRouter.post('/verify-email', EmailController.sendVerifyEmail);

// Route for sending project creation email
EmailRouter.post('/project-creation-email', EmailController.sendProjectCreationEmail);

module.exports = EmailRouter;
