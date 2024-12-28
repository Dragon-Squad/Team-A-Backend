const { createClient } = require("redis");
require("dotenv").config();

let redisClient1 = undefined;
let redisClient2 = undefined;

async function initializeRedisClients() {
  let redisURL1 = process.env.REDIS_URL_INSTANCE_1 || "redis://localhost:6379";
  let redisURL2 = process.env.REDIS_URL_INSTANCE_2 || "redis://localhost:6380";
  console.log("Redis URLs: ", redisURL1, redisURL2);

  try {
    // Create Redis client objects for both instances
    redisClient1 = createClient({ url: redisURL1 }).on("error", (e) => {
      console.error(`Failed to create Redis client 1 with error:`);
      console.error(e);
    });
    redisClient2 = createClient({ url: redisURL2 }).on("error", (e) => {
      console.error(`Failed to create Redis client 2 with error:`);
      console.error(e);
    });

    // Connect to the Redis servers
    await redisClient1.connect();
    console.log(`Connected to Redis instance 1 successfully!`);
    await redisClient2.connect();
    console.log(`Connected to Redis instance 2 successfully!`);

    return { redisClient1, redisClient2 };
  } catch (e) {
    console.error(`Connection to Redis failed with error:`);
    console.error(e);
  }
}

module.exports = { initializeRedisClients };
