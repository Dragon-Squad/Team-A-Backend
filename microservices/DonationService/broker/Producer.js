const { Kafka, logLevel, Partitioners } = require("kafkajs");

// Configuration properties
const CLIENT_ID = "DonationA";
const BROKERS = process.env.BROKERS; 

const kafka = new Kafka({
  clientId: CLIENT_ID,
  brokers: [BROKERS],
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

const publish = async (data) => {
  const producer = await connectProducer();
  try {
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

module.exports = { publish };

