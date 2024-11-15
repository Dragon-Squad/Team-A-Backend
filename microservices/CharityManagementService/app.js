const { app, SERVER_PORT, configureApp, errorHandler } = require("./config/AppConfig");
const { connectDB } = require("./config/DBconfig");
const CharityService = require("./Charity/CharityService");
const MessageBroker = require("./broker/MessageBroker");

const runApp = async () => {
  try {
    // Connect to DB
    await connectDB();

    // Configure the app
    configureApp();

    // connect to the producer and consumer
    const producer = await MessageBroker.connectProducer();
    producer.on("producer.connect", () => {
      console.log("producer connected");
    });

    const consumer = await MessageBroker.connectConsumer();
    consumer.on("consumer.connect", () => {
      console.log("consumer connected");
    });

    await MessageBroker.subscribe("SearchCharities", CharityService.searchByName);

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
