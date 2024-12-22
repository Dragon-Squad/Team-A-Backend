const express = require("express");
const ProjectController = require("./ProjectController");
const ProjectRouter = express.Router();

ProjectRouter.get("/all", ProjectController.getAll);

ProjectRouter.delete("/:id", ProjectController.delete);

ProjectRouter.get("/:id", ProjectController.getById);

module.exports = ProjectRouter;
