const express = require("express");
const DeletedProjectController = require("./DeletedProjectController");
const DeletedProjectRouter = express.Router();

DeletedProjectRouter.get("/all", DeletedProjectController.getAll);

DeletedProjectRouter.delete("/:id", DeletedProjectController.delete);

DeletedProjectRouter.get("/:id", DeletedProjectController.getById);

module.exports = DeletedProjectRouter;
