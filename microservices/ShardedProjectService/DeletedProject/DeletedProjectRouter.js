const express = require("express");
const DeletedProjectController = require("./DeletedProjectController");
const DeletedProjectRouter = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const UserType = require("../enum/UserType");

DeletedProjectRouter.get(
    "/all",
    authenticate,
    authorize([UserType.ADMIN]),
    DeletedProjectController.getAll
);

DeletedProjectRouter.delete(
    "/:id",
    authenticate,
    authorize([UserType.ADMIN]),
    DeletedProjectController.delete
);

DeletedProjectRouter.get(
    "/:id",
    authenticate,
    authorize([UserType.DONOR, UserType.CHARITY]),
    DeletedProjectController.getById
);

module.exports = DeletedProjectRouter;
