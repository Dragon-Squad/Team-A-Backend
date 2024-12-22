const express = require('express');
const WebhookController = require('./WebhookController');
const WebhookRouter = express.Router();
const bodyParser = require('body-parser');

WebhookRouter.post(
  '/handle', 
  bodyParser.raw({ type: 'application/json' }), 
  WebhookController.handleWebhook
);

module.exports = WebhookRouter;
