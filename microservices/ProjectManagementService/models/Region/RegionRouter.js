const express = require('express');
const RegionController = require('./RegionController');
const { authenticate, authorize } = require('../../middleware/auth');
const UserType = require('../../enum/UserType');

const RegionRouter = express.Router();

RegionRouter.get('/all', RegionController.getAllRegions);

RegionRouter.get(
    '/:id', 
    authenticate,
    authorize([UserType.DONOR, UserType.CHARITY, UserType.ADMIN]),
    RegionController.getRegionById
);

RegionRouter.post(
    '/subscribe/:id',
    authenticate,
    authorize([UserType.DONOR]),
    RegionController.subscribe
);

RegionRouter.post(
    '/notification-on/:id',
    authenticate,
    authorize([UserType.DONOR]),
    RegionController.notificationOn
);

RegionRouter.post(
    '/unsubscribe/:id',
    authenticate,
    authorize([UserType.DONOR]),
    RegionController.unsubscribe
);

RegionRouter.post(
    '/notification-off/:id',
    authenticate,
    authorize([UserType.DONOR]),
    RegionController.notificationOff
);

module.exports = RegionRouter;
