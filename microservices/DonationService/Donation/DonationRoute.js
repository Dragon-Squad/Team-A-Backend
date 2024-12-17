const express = require('express');
const DonationController = require('./DonationController');
const DonationRouter = express.Router();
const bodyParser = require('body-parser');

DonationRouter.post(
  '/new',
  DonationController.donate
);

DonationRouter.post(
  '/webhook/handle', 
  bodyParser.raw({ type: 'application/json' }), 
  DonationController.handleWebhook
);

module.exports = DonationRouter;
