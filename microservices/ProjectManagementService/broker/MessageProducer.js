const { Kafka, logLevel, Partitioners } = require("kafkajs");

// Configuration properties
const CLIENT_ID = process.env.CLIENT_ID || "project-service";
const BROKERS = ["172.18.0.4:9092"]; 

const kafka = new Kafka({
  clientId: CLIENT_ID,
  brokers: BROKERS,
  logLevel: logLevel.INFO,
});

let producer;

const connectProducer = async () => {
  if (producer) {
    console.log("Producer already connected with existing connection.");
    return producer;
  }

  producer = kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
  });

  await producer.connect();
  console.log("Producer connected successfully.");
  return producer;
};

const disconnectProducer = async () => {
  if (producer) {
    await producer.disconnect();
    console.log("Producer disconnected successfully.");
  }
};

const publish = async (data) => {
  const producer = await connectProducer();

  const result = await producer.send({
    topic: data.topic, 
    messages: [
      {
        key: data.event,
        value: JSON.stringify(data.message), 
      },
    ],
  });
  
  console.log("Publishing result:", result);
  return result.length > 0;
};

module.exports = {
  connectProducer,
  disconnectProducer,
  publish,
};
