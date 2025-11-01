// configs/redis.js - FIXED VERSION
import redis from 'redis';

class RedisClient {
  constructor() {
    this.client = redis.createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
      },
      password: process.env.REDIS_PASSWORD || undefined,
    });

    this.client.on('error', (err) => {
      console.log('Redis Client Error', err);
    });

    this.client.on('connect', () => {
      console.log('✅ Connected to Redis successfully');
    });

    this.connect();
  }

  async connect() {
    await this.client.connect();
  }

  // ✅ FIXED: For simple string values (blacklist, refresh tokens)
  async set(key, value, mode = null, expiry = null) {
    try {
      if (mode === 'EX' && expiry) {
        // For blacklist tokens - store as simple string
        await this.client.setEx(key, expiry, value);
      } else if (expiry) {
        // Backward compatibility
        await this.client.setEx(key, expiry, value);
      } else {
        // Without expiry
        await this.client.set(key, value);
      }
      console.log(`✅ Redis SET: ${key} = ${value} ${expiry ? `(expires in ${expiry}s)` : ''}`);
      return true;
    } catch (error) {
      console.error('❌ Redis set error:', error);
      return false;
    }
  }

  // ✅ FIXED: For simple string values
  async get(key) {
    try {
      const data = await this.client.get(key);
      console.log(`🔍 Redis GET: ${key} = ${data}`);
      return data;
    } catch (error) {
      console.error('❌ Redis get error:', error);
      return null;
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
      console.log(`🗑️ Redis DEL: ${key}`);
      return true;
    } catch (error) {
      console.error('❌ Redis delete error:', error);
      return false;
    }
  }

  async exists(key) {
    try {
      const result = await this.client.exists(key);
      console.log(`🔎 Redis EXISTS: ${key} = ${result === 1}`);
      return result === 1;
    } catch (error) {
      console.error('❌ Redis exists error:', error);
      return false;
    }
  }

  // ✅ NEW: Method to scan all keys (for debugging)
  async scanKeys(pattern = '*') {
    try {
      const keys = [];
      for await (const key of this.client.scanIterator({
        MATCH: pattern,
        COUNT: 100
      })) {
        keys.push(key);
      }
      console.log(`🔍 Redis SCAN ${pattern}:`, keys);
      return keys;
    } catch (error) {
      console.error('❌ Redis scan error:', error);
      return [];
    }
  }
}

export default new RedisClient();