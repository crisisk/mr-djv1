const fs = require('fs');
const path = require('path');
const config = require('../config');
const managedEnv = require('../lib/managedEnv');

/**
 * @typedef {Object} DashboardEntry
 * @property {string} name
 * @property {boolean} hasValue
 * @property {string|null} preview
 */

/**
 * @typedef {Object} DashboardGroup
 * @property {string} id
 * @property {string} label
 * @property {string} [description]
 * @property {DashboardEntry[]} entries
 */

/**
 * @typedef {Object} DashboardState
 * @property {string[]} managedKeys
 * @property {DashboardEntry[]} entries
 * @property {DashboardGroup[]} groups
 * @property {{ storePath: string, lastModified: string|null }} metadata
 */

/**
 * Replaces sensitive values with a masked representation.
 *
 * @param {string|null|undefined} value
 * @returns {string|null}
 */
function maskValue(value) {
  if (!value) {
    return null;
  }

  if (value.length <= 4) {
    return '*'.repeat(value.length);
  }

  const visible = value.slice(-4);
  return `${'*'.repeat(value.length - 4)}${visible}`;
}

/**
 * Normalizes user supplied values to strings for storage.
 *
 * @param {unknown} value
 * @returns {string|null}
 */
function normalizeValue(value) {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== 'string') {
    return String(value);
  }

  return value;
}

/**
 * Loads the managed environment file.
 *
 * @returns {Object<string, string>}
 */
function getCurrentValues() {
  const fileValues = managedEnv.loadFromDiskSync();
  return { ...fileValues };
}

/**
 * Builds the dashboard view model for the provided configuration values.
 *
 * @param {Object<string, string>} values
 * @returns {DashboardState}
 */
function buildState(values) {
  const entryMap = new Map();
  const entries = config.dashboard.managedKeys.map((key) => {
    const existing = values[key];
    const effective = existing ?? process.env[key] ?? null;

    const entry = {
      name: key,
      hasValue: Boolean(effective),
      preview: effective ? maskValue(String(effective)) : null
    };

    entryMap.set(key, entry);
    return entry;
  });

  const groups = (config.dashboard.sections || []).map((section) => ({
    id: section.id,
    label: section.label,
    description: section.description,
    entries: section.keys.map((key) => entryMap.get(key)).filter(Boolean)
  }));

  let lastModified = null;
  const storePath = managedEnv.getStorePath();
  try {
    const stats = fs.statSync(storePath);
    lastModified = stats.mtime.toISOString();
  } catch (_error) {
    lastModified = null;
  }

  return {
    managedKeys: [...config.dashboard.managedKeys],
    entries,
    groups,
    metadata: {
      storePath: path.relative(process.cwd(), storePath),
      lastModified
    }
  };
}

/**
 * Persists submitted dashboard changes and reloads runtime config.
 *
 * @param {Object<string, *>} payload
 * @returns {Promise<DashboardState>}
 */
async function updateValues(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('Invalid payload');
  }

  const currentValues = getCurrentValues();
  const nextValues = { ...currentValues };

  for (const key of config.dashboard.managedKeys) {
    if (!(key in payload)) {
      continue;
    }

    const rawValue = normalizeValue(payload[key]);

    if (rawValue === null) {
      continue;
    }

    if (rawValue === '') {
      delete nextValues[key];
      delete process.env[key];
      continue;
    }

    nextValues[key] = rawValue;
    process.env[key] = rawValue;
  }

  await managedEnv.write(nextValues);
  config.reload();

  return buildState(nextValues);
}

/**
 * Returns the current dashboard state for rendering.
 *
 * @returns {DashboardState}
 */
function getState() {
  const values = getCurrentValues();
  return buildState(values);
}

function ping() {
  return {
    ok: true,
    enabled: Boolean(config.dashboard.enabled),
    managedKeyCount: config.dashboard.managedKeys.length,
    storePath: path.relative(process.cwd(), config.dashboard.storePath)
  };
}

module.exports = {
  getState,
  updateValues,
  ping
};
