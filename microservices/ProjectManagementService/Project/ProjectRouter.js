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
ProjectRouter.put("/:id", ProjectController.update);
ProjectRouter.delete("/:id", ProjectController.delete);

ProjectRouter.get("/:id", ProjectController.getById);
ProjectRouter.get("/", ProjectController.getAll);

module.exports = ProjectRouter;
