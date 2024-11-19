const { app, SERVER_PORT, configureApp, errorHandler } = require("./Config/AppConfig");
const { connectDB } = require("./Config/DBConfig");
const ProjectRouter = require("./Project/ProjectRouter");
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

    // Add routes
    app.use(`/charitan/api/v1/project/`, ProjectRouter);

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
