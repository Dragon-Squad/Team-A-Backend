const express = require("express");
const ProjectController = require("./ProjectController");
const { authenticate, authorize } = require("../../middleware/auth");
const UserType = require('../../enum/UserType');
const ProjectRouter = express.Router();

ProjectRouter.get("/all",
  ProjectController.getAll
);

ProjectRouter.post(
  "/",
  authenticate,
  authorize([UserType.CHARITY, UserType.ADMIN]),
  ProjectController.create
);

ProjectRouter.put(
  "/:id",
  authenticate,
  authorize([UserType.CHARITY, UserType.ADMIN]),
  ProjectController.update
);

ProjectRouter.delete(
  "/:id",
  authenticate,
  authorize([UserType.CHARITY, UserType.ADMIN]),
  ProjectController.delete
);

ProjectRouter.patch(
  "/active/:id",
  authenticate,
  authorize([UserType.ADMIN]),
  ProjectController.active
);

ProjectRouter.patch(
  "/halt/:id",
  authenticate,
  authorize([UserType.CHARITY, UserType.ADMIN]),
  ProjectController.halt
);

ProjectRouter.patch(
  "/resume/:id",
  authenticate,
  authorize([UserType.CHARITY, UserType.ADMIN]),
  ProjectController.resume
);

ProjectRouter.get(
  "/:id", 
  ProjectController.getById
);

module.exports = ProjectRouter;
