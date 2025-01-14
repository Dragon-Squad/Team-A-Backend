const { Kafka, logLevel } = require("kafkajs");
const EmailExternalService = require("../Email/External/EmailExternalService");
// Configuration properties
const CLIENT_ID = "EmailA";
const GROUP_ID = "EmailA";
const BROKERS = process.env.BROKERS;
const FROM_BEGINNING = process.env.FROM_BEGINNING || true;

// Kafka instance
const kafka = new Kafka({
    clientId: CLIENT_ID,
    brokers: [BROKERS],
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
            eachMessage: async ({ key, message }) => {
                try {
                    const key = message.key?.toString();
                    const value = message.value
                        ? JSON.parse(message.value.toString())
                        : null;

                    if (value) {
                        switch (key) {
                            case "create_project":
                                await EmailExternalService.sendCharityProjectCreatedEmail(
                                    value
                                );
                                await EmailExternalService.sendDonorProjectCreatedEmail(
                                    value
                                );
                                break;

                            case "halt_project":
                                await EmailExternalService.sendCharityProjectHaltedEmail(
                                    value
                                );
                                await EmailExternalService.sendDonorProjectHaltedEmail(
                                    value
                                );
                                break;

                            case "donation_success":
                                await EmailExternalService.sendDonorDonationSuccessEmail(
                                    value
                                );
                                break;

                            case "charity_project_completed":
                                await EmailExternalService.sendCharityProjectCompletedEmail(
                                    value
                                );
                                break;

                            default:
                                console.error(
                                    `Unexpected Kafka Key in ${topic} topic: ${key}`
                                );
                        }

                        setupShutdownHooks();
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
