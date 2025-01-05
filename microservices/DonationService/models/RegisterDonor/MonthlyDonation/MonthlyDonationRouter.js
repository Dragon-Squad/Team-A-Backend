const express = require('express');
const MonthlyDonationController = require('./MonthlyDonationController');
const MonthlyDonationRouter = express.Router();

MonthlyDonationRouter.get(
    '/all', 
    MonthlyDonationController.getAllMonthlyDonations
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
    '/:id', 
    MonthlyDonationController.getMonthlyDonationById
);

MonthlyDonationRouter.get(
    '/donor/:id', 
    MonthlyDonationController.getAllMonthlyDonationsByDonor
);

module.exports = MonthlyDonationRouter;
