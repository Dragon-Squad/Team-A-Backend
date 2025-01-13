const { Kafka, logLevel } = require("kafkajs");

// Configuration properties
const CLIENT_ID = "DonationA";
const GROUP_ID = "DonationA";
const BROKERS = process.env.BROKERS;
const FROM_BEGINNING = process.env.FROM_BEGINNING || true;

const kafka = new Kafka({
  clientId: CLIENT_ID,
  brokers: [BROKERS],
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

module.exports = { connectConsumer };
