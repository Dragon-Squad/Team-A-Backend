const { Kafka, logLevel, Partitioners } = require("kafkajs");

// configuration properties
const CLIENT_ID = process.env.CLIENT_ID || "project-service";
const GROUP_ID = process.env.GROUP_ID || "charity-service-group";
const BROKERS = ["172.18.0.3:9092"];

const kafka = new Kafka({
  clientId: CLIENT_ID,
  brokers: BROKERS,
  logLevel: logLevel.INFO,
});

let producer;
let consumer;

const createTopic = async (topic) => {
  const topics = topic.map((t) => ({
    topic: t,
    numPartitions: 2,
    replicationFactor: 1, 
  }));

  const admin = kafka.admin();
  await admin.connect();
  const topicExists = (await admin.fetchTopicMetadata()).topics.map(t => console.log(t.name));
  for (const t of topics) {
    if (!topicExists.includes(t.topic)) {
      await admin.createTopics({
        topics: [t],
      });
    }
  }
  await admin.disconnect();
};

const connectProducer = async () => {
  await createTopic(["SearchCharities"]);
  await createTopic(["ValidateCharityId"]);

  if (producer) {
    console.log("producer already connected with existing connection");
    return producer;
  }

  producer = kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
  });

  await producer.connect();
  console.log("producer connected with a new connection");
  return producer;
};

const disconnectProducer = async () => {
  if (producer) {
    await producer.disconnect();
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
  console.log("publishing result", result);
  return result.length > 0;
};

// Consumer functionality
const connectConsumer = async() => {
  if (consumer) {
    return consumer;
  }

  consumer = kafka.consumer({
    groupId: GROUP_ID,
  });

  await consumer.connect();
  return consumer;
};

const disconnectConsumer = async () => {
  if (consumer) {
    await consumer.disconnect();
  }
};

const subscribe = async (topic) => {
  const consumer = await connectConsumer();
  await consumer.subscribe({ topic: topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (topic != "SearchCharities" || topic != "ValidateCharityId") {
        return
      }

      const key = message.key.toString();
      const data = message.value ? JSON.parse(message.value.toString()) : null;
      console.log(key);
      console.log(data);
      
      if(message.key == "Response" && data){
        return data;
      }
    },
  });
};

module.exports = {
  connectProducer,
  disconnectProducer,
  publish,
  connectConsumer,
  disconnectConsumer,
  subscribe,
};

