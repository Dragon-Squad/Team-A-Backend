const express = require('express');
const CharityController = require('./CharityController');
const CharityRouter = express.Router();

CharityRouter.get(
    '/', 
    CharityController.searchByName
);

module.exports = CharityRouter;