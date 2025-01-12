const { app, SERVER_PORT, configureApp, errorHandler } = require("./Config/AppConfig");
const { connectDB } = require("./Config/DBConfig");
const DeletedProjectRouter = require("./DeletedProject/DeletedProjectRouter");
const CompletedProjectRouter = require("./CompletedProject/CompletedProjectRouter");
const Consumer = require("./broker/Consumer");

const runApp = async () => {
  try {
    // Connect to DB
    await connectDB();

    // Configure the app
    configureApp();

    await Consumer.subscribe("project_to_shard");

    // Add routes
    app.use(`/deleted/projects`, DeletedProjectRouter);
    app.use(`/completed/projects`, CompletedProjectRouter);

    app.get('/health-check', (req, res) => {
      res.status(200).json({ message: 'Server is working!' });
    });

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
