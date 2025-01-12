require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const helmet = require("helmet");
const httpStatus = require("http-status");
const EmailRouter = require('./Email/EmailRouter');
const { subscribe } = require("./broker/Consumer");

const app = express();
const SERVER_PORT = process.env.EMAIL_SERVER_PORT || 8002;
const CLIENT_PORT = process.env.CLIENT_PORT || 2582;

const runApp = async () => {
  try {
    // CORS setup
    const whitelistedCors = [
      `http://localhost:${SERVER_PORT}`,
      `http://localhost:${CLIENT_PORT}`,
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

    await subscribe("to_email");

    app.use(`/email`, EmailRouter);

    app.get('/health-check', (req, res) => {
      res.status(200).json({ message: 'Server is working!' });
    });

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
