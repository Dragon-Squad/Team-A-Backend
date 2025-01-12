const { initializeRedisClients } = require("./redisConfig");
const hash = require("object-hash");
const crypto = require("crypto");

class RedisMiddleware {
  constructor() {
    this.redisClient1 = null;
    this.redisClient2 = null;
    this.initRedisClients();
  }

  async initRedisClients() {
    const { redisClient1, redisClient2 } = await initializeRedisClients();
    this.redisClient1 = redisClient1;
    this.redisClient2 = redisClient2;
    console.log(
      "Redis clients initialized:",
      this.redisClient1?.isOpen,
      this.redisClient2?.isOpen
    );
  }

  // This function will hash the client ID to decide which Redis instance to use
  getRedisClientForSession(clientId) {
    const hashValue = crypto
      .createHash("sha256")
      .update(clientId)
      .digest("hex");
    const hashInt = parseInt(hashValue, 16);
    return hashInt % 2 === 0 ? this.redisClient1 : this.redisClient2;
  }

  // Generate a key for Redis based on request data (for caching purposes)
  requestToKey(req) {
    console.log("Request to key input:", req); // Debug request input
    const reqDataToHash = {
      query: req.query,
      body: req.body,
    };

    console.log("Hashing request data:", reqDataToHash); // Debug data before hashing
    const key = `${req.path}@${hash(reqDataToHash, { algorithm: "sha1" })}`;
    console.log("Generated key:", key); // Debug generated key
    return key;
  }

  // Check if the Redis client is working
  async isRedisClientWorking(redisClient) {
    const status = redisClient?.isOpen;
    console.log("Redis client is open:", !!status);
    return !!status;
  }

  // Write data to Redis (ensuring the correct client is used)
  async writeData(clientId, key, data, options = { EX: 3600 }) {
    const redisClient = this.getRedisClientForSession(clientId); // Choose Redis instance based on clientId
    if (await this.isRedisClientWorking(redisClient)) {
      try {
        const stringifiedData = JSON.stringify(data);
        await redisClient.set(key, stringifiedData, options);
        console.log(`Data written to Redis with key: ${key}`);
      } catch (error) {
        console.error(`Failed to write data to Redis with key ${key}:`, error);
      }
    }
  }

  // Read data from Redis (ensuring the correct client is used)
  async readData(clientId, key) {
    const redisClient = this.getRedisClientForSession(clientId); // Choose Redis instance based on clientId
    if (await this.isRedisClientWorking(redisClient)) {
      try {
        const cachedValue = await redisClient.get(key);
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
