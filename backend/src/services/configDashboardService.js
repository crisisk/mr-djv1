const fs = require('fs');
const path = require('path');
const config = require('../config');
const managedEnv = require('../lib/managedEnv');

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

function normalizeValue(value) {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== 'string') {
    return String(value);
  }

  return value;
}

function getCurrentValues() {
  const fileValues = managedEnv.loadFromDiskSync();
  return { ...fileValues };
}

function buildState(values) {
  const entries = config.dashboard.managedKeys.map((key) => {
    const existing = values[key];
    const effective = existing ?? process.env[key] ?? null;

    return {
      name: key,
      hasValue: Boolean(effective),
      preview: effective ? maskValue(String(effective)) : null
    };
  });

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
    metadata: {
      storePath: path.relative(process.cwd(), storePath),
      lastModified
    }
  };
}

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

function getState() {
  const values = getCurrentValues();
  return buildState(values);
}

module.exports = {
  getState,
  updateValues
};
