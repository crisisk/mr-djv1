const config = require('../config');
const { getSharedRedisClient } = require('./redis');

const memoryStore = new Map();

function getNamespace() {
  return config.redis?.namespace || 'mr-dj';
}

function buildKey(key) {
  return `${getNamespace()}:cache:${key}`;
}

function storeInMemory(key, value, ttlMs) {
  const expiresAt = ttlMs > 0 ? Date.now() + ttlMs : null;
  memoryStore.set(key, { value, expiresAt });
}

function getFromMemory(key) {
  const entry = memoryStore.get(key);
  if (!entry) {
    return undefined;
  }

  if (entry.expiresAt && entry.expiresAt < Date.now()) {
    memoryStore.delete(key);
    return undefined;
  }

  return entry.value;
}

async function set(key, value, ttlMs = 300000) {
  const client = await getSharedRedisClient();
  if (client) {
    const namespacedKey = buildKey(key);
    const payload = JSON.stringify(value);
    try {
      if (ttlMs > 0) {
        await client.set(namespacedKey, payload, 'PX', ttlMs);
      } else {
        await client.set(namespacedKey, payload);
      }
      return;
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') {
        console.error('[cache] Failed to store value in Redis', error);
      }
    }
  }

  storeInMemory(key, value, ttlMs);
}

async function get(key) {
  const client = await getSharedRedisClient();
  if (client) {
    try {
      const payload = await client.get(buildKey(key));
      if (payload == null) {
        return undefined;
      }
      return JSON.parse(payload);
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') {
        console.error('[cache] Failed to read value from Redis', error);
      }
    }
  }

  return getFromMemory(key);
}

async function del(key) {
  const client = await getSharedRedisClient();
  if (client) {
    try {
      await client.del(buildKey(key));
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') {
        console.error('[cache] Failed to delete value from Redis', error);
      }
    }
  }

  memoryStore.delete(key);
}

async function clear() {
  const client = await getSharedRedisClient();
  if (client) {
    try {
      const keys = await client.keys(buildKey('*'));
      if (keys.length) {
        await client.del(...keys);
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') {
        console.error('[cache] Failed to clear Redis cache', error);
      }
    }
  }

  memoryStore.clear();
}

module.exports = {
  set,
  get,
  del,
  clear
};
