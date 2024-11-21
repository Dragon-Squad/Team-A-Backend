const express = require('express');
const UploadController = require('./UploadController');
// const { authenticate, authorize } = require("../../middleware/auth");
// const UserType = require('../user/enum/userType');
const UploadRouter = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/png",
      "image/jpeg",
      "video/mp4"
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only png, jpg, jpeg and mp4 are allowed."));
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 10 
  }
});

UploadRouter.post(
    '/upload/:bucket',
    upload.array("files", 15),
    UploadController.uploadFiles
);

UploadRouter.get(
    '', 
    UploadController.retrieveFilesByProject
);

module.exports = UploadRouter;