const store = new Map();

function set(key, value, ttlMs = 300000) {
  const expiresAt = ttlMs > 0 ? Date.now() + ttlMs : null;
  store.set(key, { value, expiresAt });
}

function get(key) {
  const entry = store.get(key);
  if (!entry) return undefined;

  if (entry.expiresAt && entry.expiresAt < Date.now()) {
    store.delete(key);
    return undefined;
  }

  return entry.value;
}

function del(key) {
  store.delete(key);
}

function clear() {
  store.clear();
}

module.exports = {
  set,
  get,
  del,
  clear
};
