const NodeCache = require('node-cache');

const cache = new NodeCache({
  stdTTL: 0,
  checkperiod: 60,
  useClones: false
});

function ttlMsToSeconds(ttlMs) {
  if (!Number.isFinite(ttlMs) || ttlMs <= 0) {
    return 0;
  }

  return ttlMs / 1000;
}

function set(key, value, ttlMs = 0) {
  const ttlSeconds = ttlMsToSeconds(ttlMs);
  cache.set(key, value, ttlSeconds);
  return value;
}

function get(key) {
  return cache.get(key);
}

function del(key) {
  cache.del(key);
}

function clear() {
  cache.flushAll();
}

async function remember(key, ttlMs, factory) {
  if (typeof factory !== 'function') {
    throw new TypeError('factory must be a function');
  }

  const existing = get(key);
  if (existing !== undefined) {
    return { value: existing, fresh: false };
  }

  const value = await factory();
  set(key, value, ttlMs);
  return { value, fresh: true };
}

module.exports = {
  set,
  get,
  del,
  clear,
  remember
};
