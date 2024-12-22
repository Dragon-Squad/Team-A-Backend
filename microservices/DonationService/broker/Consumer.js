const { Kafka, logLevel } = require("kafkajs");

// Configuration properties
const CLIENT_ID = process.env.CLIENT_ID || "Donation";
const GROUP_ID = process.env.GROUP_ID || "Donation";
const BROKERS = process.env.BROKERS ? process.env.BROKERS.split(",") : ["172.18.0.4:9092"];
const FROM_BEGINNING = process.env.FROM_BEGINNING === "true";

const kafka = new Kafka({
  clientId: CLIENT_ID,
  brokers: BROKERS,
  logLevel: logLevel.WARN,
});

let consumer;

const connectConsumer = async (topic) => {
  if (consumer) return consumer;

  consumer = kafka.consumer({ groupId: GROUP_ID });
  await consumer.connect();
  console.log("Consumer connected to Kafka");

  // Subscribe to the topic before starting to consume messages
  await consumer.subscribe({ topic, fromBeginning: FROM_BEGINNING });
  console.log(`Subscribed to topic: ${topic}`);

  return consumer;
};

const subscribe = async (topic, correlationId) => {
  const consumer = await connectConsumer(topic);

  return new Promise((resolve, reject) => {
    if (!consumer.isRunning) {
      consumer.isRunning = true;
      consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const value = message.value ? JSON.parse(message.value.toString()) : null;

          if (correlationId === value.correlationId) {
            resolve(value.project); 
            return; 
          }
        },
      });
    }
  });
};

module.exports = { subscribe };
