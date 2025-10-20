const fs = require('fs');
const path = require('path');
const managedEnv = require('./managedEnv');

const FLAG_PREFIX = 'FLAG_';
const CACHE_TTL_MS = 30 * 1000;
const MANIFEST_PATH = path.resolve(__dirname, '..', '..', '..', 'config', 'feature-flags.json');

let manifestCache = null;
let manifestLoadedAt = 0;
let cache = null;
let cacheExpiresAt = 0;

function normalizeKey(name) {
  if (!name) {
    return '';
  }

  return String(name)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');
}

function toEnvKey(name) {
  const normalized = String(name || '')
    .trim()
    .replace(/[^A-Za-z0-9]+/g, '_')
    .toUpperCase();

  if (!normalized) {
    return null;
  }

  return `${FLAG_PREFIX}${normalized}`;
}

function coerceToBoolean(value) {
  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  const normalized = String(value).trim().toLowerCase();

  if (!normalized) {
    return false;
  }

  if (['1', 'true', 'yes', 'on', 'enabled'].includes(normalized)) {
    return true;
  }

  if (['0', 'false', 'no', 'off', 'disabled'].includes(normalized)) {
    return false;
  }

  return Boolean(normalized);
}

function loadManifest() {
  if (manifestCache && Date.now() - manifestLoadedAt < CACHE_TTL_MS) {
    return manifestCache;
  }

  try {
    const raw = fs.readFileSync(MANIFEST_PATH, 'utf8');
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      throw new Error('Manifest must be an array of flag definitions');
    }

    const definitions = parsed
      .map((entry) => {
        if (!entry || typeof entry !== 'object') {
          return null;
        }

        const key = normalizeKey(entry.key);
        if (!key) {
          return null;
        }

        return {
          key,
          rawKey: entry.key,
          envKey: toEnvKey(entry.key),
          defaultState: coerceToBoolean(entry.defaultState),
          description: entry.description ? String(entry.description) : null
        };
      })
      .filter(Boolean);

    manifestCache = definitions;
    manifestLoadedAt = Date.now();
  } catch (error) {
    console.warn('[featureFlags] Failed to load manifest:', error.message);
    manifestCache = [];
    manifestLoadedAt = Date.now();
  }

  return manifestCache;
}

function buildCache() {
  const manifest = loadManifest();
  const managedOverrides = managedEnv.loadFromDiskSync();

  const result = new Map();
  const definitionMap = new Map();

  for (const definition of manifest) {
    definitionMap.set(definition.key, definition);
    result.set(definition.key, {
      value: Boolean(definition.defaultState),
      defaultState: Boolean(definition.defaultState),
      description: definition.description,
      envKey: definition.envKey || toEnvKey(definition.key)
    });
  }

  const sources = [managedOverrides, process.env];

  for (const source of sources) {
    if (!source || typeof source !== 'object') {
      continue;
    }

    for (const [envKey, rawValue] of Object.entries(source)) {
      if (!envKey || !envKey.startsWith(FLAG_PREFIX)) {
        continue;
      }

      const normalized = normalizeKey(envKey.slice(FLAG_PREFIX.length));
      if (!normalized) {
        continue;
      }

      const definition = definitionMap.get(normalized);
      const existing = result.get(normalized);
      const value = coerceToBoolean(rawValue);

      if (existing) {
        existing.value = value;
        existing.envKey = existing.envKey || envKey;
      } else {
        result.set(normalized, {
          value,
          defaultState: definition ? Boolean(definition.defaultState) : false,
          description: definition ? definition.description : null,
          envKey: definition?.envKey || envKey
        });
      }
    }
  }

  return {
    values: result,
    definitions: definitionMap
  };
}

function ensureCache(force = false) {
  if (force || !cache || Date.now() > cacheExpiresAt) {
    cache = buildCache();
    cacheExpiresAt = Date.now() + CACHE_TTL_MS;
  }

  return cache;
}

function getFlag(name, { forceReload = false } = {}) {
  const normalized = normalizeKey(name);
  if (!normalized) {
    return {
      key: null,
      envKey: null,
      value: false,
      defaultState: false,
      description: null
    };
  }

  const state = ensureCache(forceReload);
  const entry = state.values.get(normalized);

  if (entry) {
    return {
      key: normalized,
      envKey: entry.envKey,
      value: Boolean(entry.value),
      defaultState: Boolean(entry.defaultState),
      description: entry.description
    };
  }

  return {
    key: normalized,
    envKey: toEnvKey(normalized),
    value: false,
    defaultState: false,
    description: null
  };
}

function isEnabled(name, options) {
  return Boolean(getFlag(name, options).value);
}

async function refreshIfNeeded(force = false) {
  ensureCache(force);
  return cache.values;
}

async function getAll() {
  const state = ensureCache();
  return Object.fromEntries(
    Array.from(state.values.entries()).map(([key, entry]) => [key, Boolean(entry.value)])
  );
}

async function getActive() {
  const all = await getAll();
  return Object.entries(all)
    .filter(([, enabled]) => Boolean(enabled))
    .map(([key]) => key);
}

function guard(featureName, options = {}) {
  const statusCode = options.statusCode || 404;
  const message = options.message || 'Not Found';

  return async (req, res, next) => {
    try {
      await refreshIfNeeded();
      if (!isEnabled(featureName)) {
        res.status(statusCode).json({ error: message });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

function clearCache() {
  cache = null;
  cacheExpiresAt = 0;
  manifestCache = null;
  manifestLoadedAt = 0;
}

module.exports = {
  getFlag,
  isEnabled,
  getAll,
  getActive,
  refreshIfNeeded,
  guard,
  clearCache
};
