const express = require('express');
const RegionController = require('./RegionController');

const RegionRouter = express.Router();

RegionRouter.get('/:id', RegionController.getRegionById);
RegionRouter.post('/subscribe/:id', RegionController.subscribe);
RegionRouter.post('/notification-on/:id', RegionController.notificationOn);
RegionRouter.post('/unsubscribe/:id', RegionController.unsubscribe);
RegionRouter.post('/notification-off/:id', RegionController.notificationOff);

module.exports = RegionRouter;