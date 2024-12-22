const { app, SERVER_PORT, configureApp, errorHandler } = require("./Config/AppConfig");
const { connectDB } = require("./Config/DBConfig");
const ProjectRouter = require("./Project/ProjectRouter");
const ProjectService = require("./Project/ProjectService");
const MessageConsumer = require("./broker/MessageConsumer");

const runApp = async () => {
  try {
    // Connect to DB
    await connectDB();

    // Configure the app
    configureApp();

    await MessageConsumer.subscribe("project_to_delete_shard", ProjectService.create);

    // Add routes
    app.use(`/deleted/projects`, ProjectRouter);
    
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
