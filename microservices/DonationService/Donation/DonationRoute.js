const express = require('express');
const DonationController = require('./DonationController');
const DonationRouter = express.Router();

DonationRouter.post(
    '/new',
    DonationController.donate
);

module.exports = DonationRouter;