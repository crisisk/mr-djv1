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

function readFromMemory(key) {
  const entry = memoryStore.get(key);
  if (!entry) {
    return undefined;
  }

  if (entry.expiresAt !== null && entry.expiresAt <= Date.now()) {
    memoryStore.delete(key);
    return undefined;
  }

  return entry.value;
}

async function set(key, value, ttlMs = 300000) {
  const client = await getSharedRedisClient();

  if (client) {
    try {
      const payload = JSON.stringify(value);
      const namespacedKey = buildKey(key);

      if (ttlMs > 0) {
        await client.set(namespacedKey, payload, 'PX', ttlMs);
      } else {
        await client.set(namespacedKey, payload);
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') {
        console.error('[cache] Failed to store value in Redis', error);
      }
    }
  }

  storeInMemory(key, value, ttlMs);
  return value;
}

async function get(key) {
  const client = await getSharedRedisClient();

  if (client) {
    try {
      const payload = await client.get(buildKey(key));

      if (payload !== null && payload !== undefined) {
        return JSON.parse(payload);
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') {
        console.error('[cache] Failed to read value from Redis', error);
      }
    }
  }

  return readFromMemory(key);
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
      const pattern = buildKey('*');
      const keys = await client.keys(pattern);
      if (Array.isArray(keys) && keys.length) {
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

async function remember(key, ttlMs, factory) {
  const cached = await get(key);
  if (cached !== undefined) {
    return { value: cached, fresh: false };
  }

  const value = await factory();
  await set(key, value, ttlMs);
  return { value, fresh: true };
}

module.exports = {
  set,
  get,
  del,
  clear,
  remember
};
