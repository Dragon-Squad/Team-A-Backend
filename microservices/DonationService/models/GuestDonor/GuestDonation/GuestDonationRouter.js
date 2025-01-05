const express = require('express');
const GuestDonationController = require('./GuestDonationController');
const GuestDonationRouter = express.Router();

GuestDonationRouter.post(
  '/new',
  GuestDonationController.donate
);

GuestDonationRouter.get(
  '/all',
  GuestDonationController.getAllGuestDonations
)

GuestDonationRouter.get(
  '/:id',
  GuestDonationController.getGuestDonationById
)

GuestDonationRouter.get(
  '/project/:id',
  GuestDonationController.getGuestDonationsByProject
)

module.exports = GuestDonationRouter;
