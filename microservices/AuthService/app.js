require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const helmet = require("helmet");
const httpStatus = require("http-status"); 
const { connectDB } = require('./config/DBConfig');
const AuthRouter = require('./Auth/AuthRouter');
const app = express();
const SERVER_PORT = process.env.AUTH_SERVER_PORT || 3000;
const CLIENT_PORT = process.env.CLIENT_PORT || 2582;

const runApp = async () => {
  try {
    // Connect to DB
    await connectDB(); 

    // Check if we need to initialize data
    // if (process.argv[2] === "init-data") {
    //   await initializeData();
    // }

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

    app.use(`/auth`, AuthRouter);

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
