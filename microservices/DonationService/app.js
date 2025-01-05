const { app, SERVER_PORT, configureApp, errorHandler } = require("./Config/AppConfig");
const { connectDB } = require("./Config/DBConfig");
const DonationRouter = require("./models/RegisterDonor/Donation/DonationRoute");
const WebhookRouter = require("./Webhook/WebhookRoute");
const MonthlyDonationRouter = require("./models/RegisterDonor/MonthlyDonation/MonthlyDonationRouter");
const GuestDonationRouter = require("./models/GuestDonor/GuestDonation/GuestDonationRouter");

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
    app.use(`/donation/guest/`, GuestDonationRouter);

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
