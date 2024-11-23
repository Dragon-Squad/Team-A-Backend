const express = require("express");
const ProjectController = require("./ProjectController");
const { authenticate, authorize } = require("../middleware/auth");
const UserType = require("../enum/UserType");
const ProjectRouter = express.Router();

ProjectRouter.post(
  "/",
  //   authenticate,
  //   authorize([UserType.ADMIN, UserType.CHARITY]),
  ProjectController.create
);

module.exports = ProjectRouter;
