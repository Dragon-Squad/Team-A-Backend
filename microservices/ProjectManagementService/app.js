const { app, SERVER_PORT, configureApp, errorHandler } = require("./Config/AppConfig");
const { connectDB } = require("./Config/DBConfig");
const ProjectRouter = require("./Project/ProjectRouter");

const runApp = async () => {
  try {
    // Connect to DB
    await connectDB();

    // Configure the app
    configureApp();

    // Add routes
    app.use(`/project`, ProjectRouter);
    app.get(`/project/test`, (req, res) => {
      res.status(200).json("OK");
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
