//redisMiddleware.js
const { initializeRedisClient } = require("../config/redisConfig");
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
    const reqDataToHash = {
      query: req.query,
      body: req.body,
    };
    return `${req.path}@${hash.sha1(reqDataToHash)}`;
  }

  async isRedisClientWorking() {
    const status = this.redisClient1?.isOpen;
    console.log("redisClient1 isOpen status:", !!status);
    return !!status;
  }

  //write Data to redis
  async writeData(key, data, options) {}

  //read Data from redis
  async readData(key) {
    let cachedValue = undefined;

    if (await this.isRedisClientWorking()) {
      // Try to get the cached response from Redis
      cachedValue = await this.redisClient1.get(key);
      if (cachedValue) {
        return cachedValue;
      }
    }
    return undefined;
  }

  //appproach: when an api is called check the redis first
  // 					if the redis dont have the data yet,
  //						then call the controller to get the data
  //						and write to the redis
  //					else the redis has the data
  //						return that data
  // );
}

module.exports = new RedisMiddleware();
