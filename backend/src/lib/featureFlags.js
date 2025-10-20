const configDashboardService = require('../services/configDashboardService');

const FLAG_PREFIX = 'FEATURE_';
const REFRESH_INTERVAL_MS = 30 * 1000;

let cache = new Map();
let lastLoaded = 0;
let pendingRefresh = null;

function normalizeName(name) {
  if (!name) {
    return '';
  }

  return String(name).trim().toLowerCase();
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

async function loadFlags() {
  const state = await configDashboardService.getState();
  const entries = Array.isArray(state?.entries) ? state.entries : [];
  const next = new Map();

  for (const entry of entries) {
    if (!entry?.name || typeof entry.name !== 'string') {
      continue;
    }

    if (!entry.name.startsWith(FLAG_PREFIX)) {
      continue;
    }

    const featureName = normalizeName(entry.name.slice(FLAG_PREFIX.length));
    const rawValue = process.env[entry.name];

    next.set(featureName, coerceToBoolean(rawValue));
  }

  cache = next;
  lastLoaded = Date.now();
  return cache;
}

function triggerRefreshIfStale() {
  if (pendingRefresh) {
    return;
  }

  if (Date.now() - lastLoaded < REFRESH_INTERVAL_MS) {
    return;
  }

  pendingRefresh = loadFlags()
    .catch((error) => {
      console.warn('[featureFlags] Failed to refresh feature flags:', error.message);
      return cache;
    })
    .finally(() => {
      pendingRefresh = null;
    });
}

async function refreshIfNeeded(force = false) {
  if (force || cache.size === 0 || Date.now() - lastLoaded > REFRESH_INTERVAL_MS) {
    if (!pendingRefresh) {
      pendingRefresh = loadFlags()
        .catch((error) => {
          console.warn('[featureFlags] Failed to refresh feature flags:', error.message);
          return cache;
        })
        .finally(() => {
          pendingRefresh = null;
        });
    }

    await pendingRefresh;
  }

  return cache;
}

function isEnabled(name) {
  const normalized = normalizeName(name);
  if (!normalized) {
    return false;
  }

  if (cache.has(normalized)) {
    triggerRefreshIfStale();
    return cache.get(normalized);
  }

  const envKey = toEnvKey(normalized);
  const value = envKey ? coerceToBoolean(process.env[envKey]) : false;
  cache.set(normalized, value);
  triggerRefreshIfStale();
  return value;
}

async function getAll() {
  await refreshIfNeeded();
  return Object.fromEntries(cache.entries());
}

async function getActive() {
  const allFlags = await getAll();
  return Object.entries(allFlags)
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

module.exports = {
  isEnabled,
  refreshIfNeeded,
  getAll,
  getActive,
  guard
};
