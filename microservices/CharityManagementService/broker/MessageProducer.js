const { Kafka, logLevel, Partitioners } = require("kafkajs");

// Configuration properties
const CLIENT_ID = process.env.CLIENT_ID || "charity-service";
const BROKERS = ["172.18.0.4:9092"]; 

const kafka = new Kafka({
  clientId: CLIENT_ID,
  brokers: BROKERS,
  logLevel: logLevel.WARN, 
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
  try{
    await producer.send({
      topic: data.topic, 
      messages: [
        {
          key: data.event,
          value: JSON.stringify(data.message), 
        },
      ],
    });

    console.log(`Message successfully published to topic ${data.topic}`);
  } catch (error){
    console.log("Error publishing message to Kafka:", error);
  } 
};

module.exports = {
  connectProducer,
  disconnectProducer,
  publish,
};
