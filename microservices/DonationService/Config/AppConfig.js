require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const helmet = require("helmet");
const httpStatus = require("http-status");

// Application settings
const SERVER_PORT = process.env.SERVER_PORT || 3005;

// Whitelisted CORS origins
const whitelistedCors = [
  `http://localhost:${SERVER_PORT}`,
  "http://localhost:3000",
];

// Initialize Express App
const app = express();

// Middleware setup
const configureApp = () => {
  app.use(helmet()); // Set security-related HTTP headers
  app.use(
    cors({
      origin: (origin, callback) => {
        if (whitelistedCors.includes(origin) || !origin) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );
  app.use(cookieParser()); // Parse cookies
  app.use(bodyParser.json()); // Parse JSON bodies
  app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
  app.use(express.static(path.join(__dirname, "../public"))); // Serve static files
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error(err);
  return res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
    error: err.message,
  });
};

module.exports = {
  app,
  SERVER_PORT,
  configureApp,
  errorHandler,
};
