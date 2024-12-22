const { app, SERVER_PORT, configureApp, errorHandler } = require("./Config/AppConfig");
const { connectDB } = require("./Config/DBConfig");
const DonationRouter = require("./Donation/DonationRoute");
const WebhookRouter = require("./Webhook/WebhookRoute");
const MonthlyDonationRouter = require("./MonthlyDonation/MonthlyDonationRouter");

const runApp = async () => {
  try {
    // Connect to DB
    await connectDB();

    // Configure the app
    configureApp();

    // Add routes
    app.use(`/donation`, DonationRouter);
    app.use(`/donation/webhook`, WebhookRouter);
    app.use(`/donation/monthly/`, MonthlyDonationRouter);

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
