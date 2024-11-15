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

const subscribe = async (topic, messageHandler) => {
  const consumer = await connectConsumer();

  // Subscribe to the topic before running the consumer
  await consumer.subscribe({ topic: topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (topic !== "SearchCharities" && topic !== "ValidateCharityId") {
        return;
      }
      console.log(topic);

      const key = message.key.toString();
      const data = message.value ? JSON.parse(message.value.toString()) : null;
      console.log(key);
      console.log(data);

      // If key is "Request" and data is present, handle the request and send a response
      if (key === "Request" && data) {
        const result = await messageHandler(data);
        console.log(result);

        // Manually commit the offset after the message is processed
        try {
          // Check if the message has an offset and commit accordingly
          if (message.offset !== undefined) {
            await consumer.commitOffsets([{
              topic,
              partition,
              offset: (Number(message.offset) + 1).toString(),  // commit the next offset
            }]);
            console.log(`Committed offset for partition ${partition}: ${Number(message.offset) + 1}`);
          }
        } catch (error) {
          console.error('Error committing offset:', error);
        }

        // Publish the result back to the producer
        await publish({
          topic: topic,
          event: "Response",
          message: result,
        });
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

