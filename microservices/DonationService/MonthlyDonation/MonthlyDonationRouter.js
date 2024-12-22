const express = require('express');
const MonthlyDonationController = require('./MonthlyDonationController');
const MonthlyDonationRouter = express.Router();

MonthlyDonationRouter.post(
    '/new', 
    MonthlyDonationController.create
);

MonthlyDonationRouter.put(
    '/:id', 
    MonthlyDonationController.update
);

MonthlyDonationRouter.put(
    '/cancel/:id', 
    MonthlyDonationController.cancel
);

MonthlyDonationRouter.get(
    '/', 
    MonthlyDonationController.getAllMonthlyDonations
);

MonthlyDonationRouter.get(
    '/:id', 
    MonthlyDonationController.getMonthlyDonationById
);

MonthlyDonationRouter.get(
    '/donor/:id', 
    MonthlyDonationController.getAllMonthlyDonationsByDonor
);

module.exports = MonthlyDonationRouter;
