const express = require('express');
const CharityController = require('./CharityController');
const CharityRouter = express.Router();

// CharityRouter.get(
//     '/', 
//     CharityController.searchByName
// );

CharityRouter.patch(
    '/payment-method/:id', 
    CharityController.updatePaymentMethod
);

module.exports = CharityRouter;