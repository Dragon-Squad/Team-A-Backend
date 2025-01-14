const express = require("express");
const MonthlyDonationController = require("./MonthlyDonationController");
const MonthlyDonationRouter = express.Router();
const { authenticate, authorize } = require("../../../middleware/auth");
const UserType = require("../../../enum/UserType");

MonthlyDonationRouter.get(
    "/all",
    authenticate,
    authorize([UserType.ADMIN]),
    MonthlyDonationController.getAllMonthlyDonations
);

MonthlyDonationRouter.put(
    "/:id",
    authenticate,
    authorize([UserType.DONOR]),
    MonthlyDonationController.update
);

MonthlyDonationRouter.put(
    "/cancel/:id",
    authenticate,
    authorize([UserType.DONOR]),
    MonthlyDonationController.cancel
);

// MonthlyDonationRouter.get(
//     '/:id',
//     authenticate,
//     authorize([UserType.DONOR, UserType.CHARITY, UserType.ADMIN]),
//     MonthlyDonationController.getMonthlyDonationById
// );

MonthlyDonationRouter.get(
    "/donor/:id",
    authenticate,
    authorize([UserType.DONOR, UserType.ADMIN]),
    MonthlyDonationController.getAllMonthlyDonationsByDonor
);

MonthlyDonationRouter.get(
    "/project/:id",
    authenticate,
    authorize([UserType.DONOR, UserType.CHARITY, UserType.ADMIN]),
    MonthlyDonationController.getMonthlyDonationsByProject
);

module.exports = MonthlyDonationRouter;
