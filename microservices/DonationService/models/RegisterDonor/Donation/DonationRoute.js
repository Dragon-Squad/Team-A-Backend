const express = require("express");
const DonationController = require("./DonationController");
const DonationRouter = express.Router();
const { authenticate, authorize } = require("../../../middleware/auth");
const UserType = require("../../../enum/UserType");

DonationRouter.post(
    "/new",
    authenticate,
    authorize([UserType.DONOR]),
    DonationController.donate
);

DonationRouter.get(
    "/all",
    authenticate,
    authorize([UserType.ADMIN]),
    DonationController.getAllDonations
);

DonationRouter.get(
    "/my",
    authenticate,
    authorize([UserType.DONOR]),
    DonationController.getMyDonations
);

// DonationRouter.get(
//   '/:id',
//   authenticate,
//   authorize([UserType.DONOR, UserType.ADMIN]),
//   DonationController.getDonationById
// )

DonationRouter.get(
    "/donor/:id",
    authenticate,
    authorize([UserType.ADMIN]),
    DonationController.getDonationsByDonor
);

DonationRouter.get("/project/:id", DonationController.getDonationsByProject);

module.exports = DonationRouter;
