const { app, SERVER_PORT, configureApp, errorHandler } = require("./Config/AppConfig");
const StatisticRouter = require('./statistic/StatisticRoute');

const runApp = async () => {
  try {
    // Configure the app
    configureApp();

    // Add routes
    app.use(`/statistic`, StatisticRouter);

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
