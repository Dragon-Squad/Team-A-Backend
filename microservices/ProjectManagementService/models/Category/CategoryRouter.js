const express = require('express');
const CategoryController = require('./CategoryController');
const { authenticate, authorize } = require('../../middleware/auth');
const UserType = require('../User/enum/userType');

const CategoryRouter = express.Router();

CategoryRouter.get('/all', CategoryController.getAllCategories);

CategoryRouter.get('/:id', CategoryController.getCategoryById);

CategoryRouter.post(
    '/subscribe/:id',
    authenticate,
    authorize([UserType.DONOR]),
    CategoryController.subscribe
);

CategoryRouter.post(
    '/notification-on/:id',
    authenticate,
    authorize([UserType.DONOR]),
    CategoryController.notificationOn
);

CategoryRouter.post(
    '/unsubscribe/:id',
    authenticate,
    authorize([UserType.DONOR]),
    CategoryController.unsubscribe
);

CategoryRouter.post(
    '/notification-off/:id',
    authenticate,
    authorize([UserType.DONOR]),
    CategoryController.notificationOff
);

module.exports = CategoryRouter;
