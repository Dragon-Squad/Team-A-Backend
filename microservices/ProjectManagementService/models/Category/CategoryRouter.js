const express = require('express');
const CategoryController = require('./CategoryController');

const CategoryRouter = express.Router();

CategoryRouter.get('/all', CategoryController.getAllCategories);
CategoryRouter.get('/:id', CategoryController.getCategoryById);
CategoryRouter.post('/subscribe/:id', CategoryController.subscribe);
CategoryRouter.post('/notification-on/:id', CategoryController.notificationOn);
CategoryRouter.post('/unsubscribe/:id', CategoryController.unsubscribe);
CategoryRouter.post('/notification-off/:id', CategoryController.notificationOff);

module.exports = CategoryRouter;