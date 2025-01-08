const express = require('express');
const GuestDonationController = require('./GuestDonationController');
const GuestDonationRouter = express.Router();
const { authenticate, authorize } = require('../../../middleware/auth');
const UserType = require('../../../enum/UserType');

GuestDonationRouter.post(
  '/new',
  GuestDonationController.donate
);

GuestDonationRouter.get(
  '/all',
  authenticate,
  authorize([UserType.ADMIN]),
  GuestDonationController.getAllGuestDonations
)

// GuestDonationRouter.get(
//   '/:id',
//   GuestDonationController.getGuestDonationById
// )

GuestDonationRouter.get(
  '/project/:id',
  GuestDonationController.getGuestDonationsByProject
)

module.exports = GuestDonationRouter;
