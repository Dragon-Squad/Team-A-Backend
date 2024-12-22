const { app, SERVER_PORT, configureApp, errorHandler } = require("./Config/AppConfig");
const { connectDB } = require("./Config/DBConfig");
const ProjectRouter = require("./Project/ProjectRouter");
const CategoryRouter = require("./Category/CategoryRouter");
const RegionRouter = require("./Region/RegionRouter");

const runApp = async () => {
  try {
    // Connect to DB
    await connectDB();

    // Configure the app
    configureApp();

    // Add routes
    app.use(`/projects`, ProjectRouter);
    app.use(`/category`, CategoryRouter);
    app.use(`/region`, RegionRouter);
    
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
