const { Kafka, logLevel } = require("kafkajs");

// Configuration properties
const CLIENT_ID = process.env.CLIENT_ID || "charity-service";
const GROUP_ID = process.env.GROUP_ID || "project-service-group";
const BROKERS = process.env.BROKERS ? process.env.BROKERS.split(",") : ["172.18.0.4:9092"];
const FROM_BEGINNING = process.env.FROM_BEGINNING === "true";

// Kafka instance
const kafka = new Kafka({
  clientId: CLIENT_ID,
  brokers: BROKERS,
  logLevel: logLevel.INFO,
});

let consumer;

// Connects the consumer to the Kafka broker
const connectConsumer = async () => {
  if (consumer) {
    return consumer;
  }

  consumer = kafka.consumer({ groupId: GROUP_ID });

  try {
    await consumer.connect();
    console.info("Consumer connected");
  } catch (error) {
    console.error("Error connecting consumer:", error);
    throw error;
  }

  return consumer;
};

// Disconnects the consumer
const disconnectConsumer = async () => {
  if (consumer) {
    try {
      await consumer.disconnect();
      console.info("Consumer disconnected");
    } catch (error) {
      console.error("Error disconnecting consumer:", error);
    }
  }
};

// Subscribes to a Kafka topic and processes messages
const subscribe = async (topic) => {
  const consumer = await connectConsumer();

  try {
    await consumer.subscribe({ topic, fromBeginning: FROM_BEGINNING });
    console.info(`Subscribed to topic: ${topic}`);

    await consumer.run({
      onmessage: async ({ topic, partition, message }) => {
        try {
          const key = message.key?.toString();
          const value = message.value ? JSON.parse(message.value.toString()) : null;

          console.info({ topic, partition, key, offset: message.offset }, "Message received");

          if (value) {
            // Commit offset manually
            if (message.offset !== undefined) {
              await consumer.commitOffsets([
                { topic, partition, offset: (Number(message.offset) + 1).toString() },
              ]);
              console.info(`Committed offset for partition ${partition}: ${Number(message.offset) + 1}`);
            }
            
            return value;
          } else {
            console.warn("Empty message received");
          }
        } catch (error) {
          console.error("Error processing message:", error);
        }
      },
    });
  } catch (error) {
    console.error("Error running consumer:", error);
    throw error;
  }
};

// Graceful shutdown handler
const setupShutdownHooks = () => {
  const shutdown = async () => {
    console.info("Shutting down...");
    await disconnectConsumer();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

// Exported functions
module.exports = {
  connectConsumer,
  disconnectConsumer,
  subscribe,
  setupShutdownHooks,
};
