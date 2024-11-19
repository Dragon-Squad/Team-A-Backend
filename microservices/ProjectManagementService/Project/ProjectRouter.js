const express = require('express');
const ProjectController = require('./ProjectController');
const { authenticate, authorize } = require("../middleware/auth");
const UserType = require('../enum/UserType');
const ProjectRouter = express.Router();

ProjectRouter.get(
    '/all', 
    authenticate,
    authorize([UserType.ADMIN, UserType.DONOR]),
    ProjectController.getAllProjects
);

ProjectRouter.get(
    '/active', 
    ProjectController.getActiveProjects
);

ProjectRouter.get(
    '/:id', 
    authenticate,
    authorize([UserType.ADMIN, UserType.DONOR, UserType.CHARITY]),
    ProjectController.getProjectById
);

ProjectRouter.get(
    '/charity/:id', 
    authenticate,
    authorize([UserType.DONOR, UserType.CHARITY]),
    ProjectController.getProjectsByCharity
);

ProjectRouter.post(
    '/new', 
    authenticate,
    authorize([UserType.ADMIN, UserType.CHARITY]),
    ProjectController.createProject
);

ProjectRouter.put(
    '/:id',
    authenticate,
    authorize([UserType.ADMIN, UserType.CHARITY]),
    ProjectController.updateProject
);

ProjectRouter.patch(
    '/:id/active',
    authenticate,
    authorize([UserType.ADMIN]), 
    ProjectController.activateProject
);

ProjectRouter.patch(
    '/:id/halt',
    authenticate,
    authorize([UserType.CHARITY]), 
    ProjectController.haltProject
);

ProjectRouter.delete(
    '/:id',
    authenticate,
    authorize([UserType.ADMIN, UserType.CHARITY]),
    ProjectController.deleteProject
);

module.exports = ProjectRouter;