const { initializeRedisClient } = require("./redisConfig");
const hash = require("object-hash");

class RedisMiddleware {
  constructor() {
    this.redisClient1 = null;
    this.initRedisClient();
  }

  async initRedisClient() {
    this.redisClient1 = await initializeRedisClient();
    console.log("Redis client initialized:", this.redisClient1?.isOpen);
  }

  requestToKey(req) {
    console.log("Request to key input:", req); // Debug request input
    const reqDataToHash = {
      query: req.query,
      body: req.body,
    };

    console.log("Hashing request data:", reqDataToHash); // Debug data before hashing
    const key = `${req.path}@${hash(reqDataToHash, {
      algorithm: "sha1",
    })}`;
    console.log("Generated key:", key); // Debug generated key
    return key;
  }

  async isRedisClientWorking() {
    const status = this.redisClient1?.isOpen;
    console.log("Redis client is open:", !!status);
    return !!status;
  }

  async writeData(key, data, options = { EX: 3600 }) {
    if (await this.isRedisClientWorking()) {
      try {
        const stringifiedData = JSON.stringify(data);
        await this.redisClient1.set(key, stringifiedData, options);
        console.log(`Data written to Redis with key: ${key}`);
      } catch (error) {
        console.error(`Failed to write data to Redis with key ${key}:`, error);
      }
    }
  }

  async readData(key) {
    if (await this.isRedisClientWorking()) {
      try {
        const cachedValue = await this.redisClient1.get(key);
        if (cachedValue) {
          return JSON.parse(cachedValue);
        }
      } catch (error) {
        console.error(`Failed to read data from Redis with key ${key}:`, error);
      }
    }
    return undefined;
  }
}

module.exports = new RedisMiddleware();
