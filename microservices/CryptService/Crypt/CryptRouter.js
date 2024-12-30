const express = require("express");
const CryptController = require("./CryptController");

const CryptRouter = express.Router();

CryptRouter.get("/asym/public", CryptController.getAsymmetricPublicKey);
CryptRouter.post("/asym/decrypt", CryptController.decryptAsymmetric);

CryptRouter.get("/jwe/public", CryptController.getJwePublicKey);
CryptRouter.get("/jwe/certificate", CryptController.getJweCertificate);
CryptRouter.post("/jwe/decrypt", CryptController.decryptJwe);

module.exports = CryptRouter;
