const express = require("express");
const StatisticController = require("./StatisticController");
const { authenticate, authorize } = require("../middleware/auth");
const UserType = require("../enum/UserType");

const StatisticRouter = express.Router();

StatisticRouter.get(
    "/donation/total",
    authenticate,
    authorize([UserType.ADMIN]),
    StatisticController.getTotalDonation
);

StatisticRouter.get(
    "/donation/compare",
    authenticate,
    authorize([UserType.ADMIN]),
    StatisticController.compareDonation
);

StatisticRouter.post(
    "/charity",
    authenticate,
    authorize([UserType.CHARITY, UserType.ADMIN]),
    StatisticController.getCharityProjectStatistic
);

module.exports = StatisticRouter;
