const express = require("express");
const CompletedProjectController = require("./CompletedProjectController");
const CompletedProjectRouter = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const UserType = require("../enum/UserType");

CompletedProjectRouter.post(
    "/archive",
    authenticate,
    authorize([UserType.ADMIN]),
    CompletedProjectController.archiveCompletedProject
);

module.exports = CompletedProjectRouter;
