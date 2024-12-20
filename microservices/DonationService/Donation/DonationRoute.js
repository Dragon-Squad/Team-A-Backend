const express = require('express');
const DonationController = require('./DonationController');
const DonationRouter = express.Router();

DonationRouter.post(
  '/new',
  DonationController.donate
);

DonationRouter.get(
  '/all',
  DonationController.getAllDonations
)

DonationRouter.get(
  '/:id',
  DonationController.getDonationById
)

DonationRouter.get(
  '/donor/:id',
  DonationController.getDonationsByDonor
)

DonationRouter.get(
  '/project/:id',
  DonationController.getDonationsByProject
)

module.exports = DonationRouter;
