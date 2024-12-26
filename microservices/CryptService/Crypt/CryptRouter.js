const express = require("express");
const CryptController = require("./CryptController");

const CryptRouter = express.Router();

CryptRouter.get("/public-key", CryptController.getPublicKey);
CryptRouter.post("/decrypt", CryptController.decrypt);

module.exports = CryptRouter;
