const { app, SERVER_PORT, configureApp, errorHandler } = require("./config/AppConfig");
const { connectDB } = require("./config/DBconfig");
const CharityService = require("./Charity/CharityService");
const MessageConsumer = require("./broker/MessageConsumer");
const CharityRouter = require("./Charity/CharityRouter");

const runApp = async () => {
  try {
    // Connect to DB
    await connectDB();

    // Configure the app
    configureApp();

    app.use(`/charity`, CharityRouter);

    // await MessageConsumer.subscribe("project_to_charity", CharityService.searchByName);

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
