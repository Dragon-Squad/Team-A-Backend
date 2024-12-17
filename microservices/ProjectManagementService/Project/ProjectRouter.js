const express = require("express");
const ProjectController = require("./ProjectController");
const { authenticate, authorize } = require("../middleware/auth");
const UserType = require("../enum/UserType");
const ProjectRouter = express.Router();

ProjectRouter.get("/all", ProjectController.getAll);
ProjectRouter.post(
  "/",
  //   authenticate,
  //   authorize([UserType.ADMIN, UserType.CHARITY]),
  ProjectController.create
);
ProjectRouter.put("/:id", ProjectController.update);
ProjectRouter.delete("/:id", ProjectController.delete);
ProjectRouter.patch("/:id/halt", ProjectController.halt);
ProjectRouter.patch("/:id/resume", ProjectController.resume);
ProjectRouter.get("/:id", ProjectController.getById);

module.exports = ProjectRouter;
