const { createClient } = require("redis");
require("dotenv").config();

let redisClient1 = undefined;

async function initializeRedisClient() {
  let redisURL = process.env.REDIS_URL_INSTANCE_1 || "redis://localhost:6379";
  console.log("redisURL: " + redisURL);
  if (redisURL) {
    // create the Redis client object
    redisClient1 = createClient({ url: redisURL }).on("error", (e) => {
      console.error(`Failed to create the Redis client with error:`);
      console.error(e);
    });

    try {
      // connect to the Redis server
      await redisClient1.connect();
      console.log(`Connected to Redis successfully!`);
      return redisClient1;
    } catch (e) {
      console.error(`Connection to Redis failed with error:`);
      console.error(e);
    }
  }
}

module.exports = { initializeRedisClient };
