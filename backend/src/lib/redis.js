const { URL } = require('url');
const config = require('../config');

let IORedis;
try {
  IORedis = require('ioredis');
} catch (_error) {
  IORedis = null;
}

const clients = new Set();
let sharedClient = null;
let sharedClientPromise = null;

function createMockRedis() {
  const mock = {
    status: 'end',
    async connect() {
      this.status = 'ready';
      return this;
    },
    async ping() {
      this.status = 'ready';
      return 'PONG';
    },
    duplicate() {
      const clone = createMockRedis();
      clone.status = this.status;
      return clone;
    },
    on() {
      return this;
    },
    async quit() {
      this.status = 'end';
    }
  };
  return mock;
}

function buildOptions() {
  if (!config.redis.url) {
    return null;
  }

  const url = new URL(config.redis.url);
  const tlsEnabled = config.redis.tls === true;
  const options = {
    url: url.toString(),
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true
  };

  if (tlsEnabled) {
    options.tls = {
      rejectUnauthorized: config.redis.tlsRejectUnauthorized !== false
    };
  }

  return options;
}

function isRedisEnabled() {
  return Boolean(IORedis) && Boolean(config.redis.url);
}

function createRedisConnection() {
  if (process.env.NODE_ENV === 'test' || !IORedis) {
    const mock = createMockRedis();
    clients.add(mock);
    return mock;
  }

  const options = buildOptions();
  if (!options) {
    const mock = createMockRedis();
    clients.add(mock);
    return mock;
  }

  const client = new IORedis(options.url, options);
  clients.add(client);
  return client;
}

async function getSharedRedisClient() {
  if (!isRedisEnabled()) {
    return null;
  }

  if (sharedClient && sharedClient.status === 'ready') {
    return sharedClient;
  }

  if (!sharedClient || sharedClient.status === 'end') {
    sharedClient = createRedisConnection();
    sharedClientPromise = null;
  }

  if (!sharedClientPromise) {
    sharedClientPromise = sharedClient
      .connect()
      .then(() => sharedClient)
      .catch((error) => {
        sharedClient = null;
        if (process.env.NODE_ENV !== 'test') {
          console.error('[redis] Failed to connect', error);
        }
        return null;
      });
  }

  return sharedClientPromise;
}

async function closeAllRedisConnections() {
  await Promise.all(
    Array.from(clients).map(async (client) => {
      try {
        await client.quit();
      } catch (error) {
        if (process.env.NODE_ENV !== 'test') {
          console.error('[redis] Failed to close client', error);
        }
      }
    })
  );
  clients.clear();
  sharedClient = null;
  sharedClientPromise = null;
}

module.exports = {
  createRedisConnection,
  getSharedRedisClient,
  closeAllRedisConnections
};
