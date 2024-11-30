require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const helmet = require("helmet");
const httpStatus = require("http-status");
const EmailRouter = require('./Email/EmailRouter');

const app = express();
const SERVER_PORT = 3001;

const runApp = async () => {
  try {
    // CORS setup
    const whitelistedCors = [
      `http://localhost:${SERVER_PORT}`,
      'http://localhost:3000',
    ];

    // Middleware setup
    app.use(helmet()); // Set security-related HTTP headers
    app.use(cors({
      origin: (origin, callback) => {
        if (whitelistedCors.includes(origin) || !origin) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    }));
    app.use(cookieParser()); // Parse cookies
    app.use(bodyParser.json()); // Parse JSON bodies
    app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
    app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

    app.use(`/charitan/api/v1/send/`, EmailRouter);

    const errorHandler = (err, req, res, next) => {
      console.error(err);
      return res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
        error: err.message,
      });
    };

    // Global error handler
    app.use(errorHandler);

    // Start the server
    app.listen(SERVER_PORT, () => {
      console.log(`Server running on port ${SERVER_PORT}`);
    });

  } catch (err) {
    console.error('Error during initialization:', err);
    process.exit(1);
  }
};

runApp();
