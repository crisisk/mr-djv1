const config = require('../config');
const { createRedisConnection } = require('../lib/redis');

let client;
let connectingPromise = null;
let lastSuccessAt = null;
let lastError = null;
let lastDurationMs = null;

function isConfigured() {
  return Boolean(config.redis?.url);
}

async function ensureClient() {
  if (!client) {
    client = createRedisConnection();
  }

  if (typeof client.connect === 'function' && client.status !== 'ready') {
    if (!connectingPromise) {
      connectingPromise = client.connect().catch((error) => {
        connectingPromise = null;
        throw error;
      });
    }
    await connectingPromise;
    connectingPromise = null;
  }

  return client;
}

async function ping() {
  const result = {
    ok: false,
    configured: isConfigured(),
    lastSuccessAt: lastSuccessAt ? lastSuccessAt.toISOString() : null,
    lastError
  };

  try {
    const redisClient = await ensureClient();
    const start = Date.now();
    const reply = typeof redisClient.ping === 'function' ? await redisClient.ping() : 'PONG';
    const duration = Date.now() - start;

    lastSuccessAt = new Date();
    lastDurationMs = duration;
    lastError = null;

    result.ok = reply === 'PONG' || reply === 'pong' || reply === true;
    result.response = reply;
    result.durationMs = duration;
    result.lastSuccessAt = lastSuccessAt.toISOString();
    result.lastError = null;
    result.connected = true;
    result.durationMs = lastDurationMs;
  } catch (error) {
    lastError = {
      at: new Date(),
      message: error.message
    };

    result.ok = false;
    result.connected = false;
    result.error = error.message;
    result.lastError = {
      at: lastError.at.toISOString(),
      message: lastError.message
    };
  }

  return result;
}

module.exports = {
  ping
};
