const { Kafka, logLevel } = require("kafkajs");
const { getProjectById, updateProjectRaisedAmount } = require("../Project/External/ProjectExternalService");

// Configuration properties
const CLIENT_ID = process.env.CLIENT_ID || "Project";
const GROUP_ID = process.env.GROUP_ID || "Project";
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

const subscribe = async (topic) => {
  const consumer = await connectConsumer(topic);

  // Ensure the consumer is not running already before calling run
  if (!consumer.isRunning) {
    consumer.isRunning = true;
    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        const value = message.value ? JSON.parse(message.value.toString()) : null;
        if (!value) {
          console.warn(`Empty message received on topic: ${topic}`);
          return;
        }
    
        // Extract the key and handle it
        const key = message.key ? message.key.toString() : null; 
        if (!key) {
          console.error(`Missing key from topic: ${topic}`);
          return;
        }
    
        console.log(`Key: ${key}`);
    
        // Handle the event
        switch (key) {
          case "verify_project":
            await getProjectById(value);
            break;
    
          case "update_project":
            await updateProjectRaisedAmount(value);
            break;
    
          default:
            console.error(`Unexpected Kafka Key in ${topic} topic: ${key}`);
        }
      },
    });
  } 
};

module.exports = { subscribe };
