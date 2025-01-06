const {
  app,
  SERVER_PORT,
  configureApp,
  errorHandler,
} = require("./Config/AppConfig");
const { connectDB } = require("./Config/DBConfig");
const ProjectRouter = require("./models/Project/ProjectRouter");
const CategoryRouter = require("./models/Category/CategoryRouter");
const RegionRouter = require("./models/Region/RegionRouter");
const { subscribe } = require("./broker/Consumer");
const { initializeRedisClients } = require("./redisConfig");

const runApp = async () => {
  try {
    // Connect to DB
    await connectDB();

    // Connect to Redis
    await initializeRedisClients();

    // Configure the app
    configureApp();

    // Add routes
    app.use(`/projects`, ProjectRouter);
    app.use(`/category`, CategoryRouter);
    app.use(`/region`, RegionRouter);

    app.get("/health/check", (req, res) => {
      res.status(200).json({ message: "Server is working!" });
    });

    // await subscribe("donation_to_project");

    // Add error handler
    app.use(errorHandler);

    // Start the server
    app.listen(SERVER_PORT, () => {
      console.log(`Server running on port ${SERVER_PORT}`);
    });
  } catch (err) {
    console.error("Error during initialization:", err);
    process.exit(1);
  }
};

runApp();
