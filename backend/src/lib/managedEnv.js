const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const DEFAULT_STORE_PATH = path.resolve(__dirname, '..', '..', 'managed.env');

function getStorePath() {
  return process.env.CONFIG_DASHBOARD_STORE_PATH
    ? path.resolve(process.cwd(), process.env.CONFIG_DASHBOARD_STORE_PATH)
    : DEFAULT_STORE_PATH;
}

function loadFromDiskSync() {
  const filePath = getStorePath();

  if (!fs.existsSync(filePath)) {
    return {};
  }

  const contents = fs.readFileSync(filePath, 'utf8');

  if (!contents.trim()) {
    return {};
  }

  try {
    return dotenv.parse(contents);
  } catch (error) {
    console.warn('[managedEnv] Failed to parse managed environment file:', error.message);
    return {};
  }
}

function loadToProcessEnv() {
  const values = loadFromDiskSync();

  for (const [key, value] of Object.entries(values)) {
    if (typeof value === 'string') {
      process.env[key] = value;
    }
  }

  return values;
}

function escapeValue(value) {
  if (value === undefined || value === null) {
    return '';
  }

  if (value === '') {
    return '';
  }

  if (/\s/.test(value) || value.includes('#') || value.includes('"')) {
    const escaped = value.replace(/"/g, '\\"');
    return `"${escaped}"`;
  }

  return value;
}

async function write(values) {
  const filePath = getStorePath();
  const sortedEntries = Object.entries(values).sort(([a], [b]) => a.localeCompare(b));
  const lines = sortedEntries.map(([key, value]) => `${key}=${escapeValue(value)}`);
  const payload = lines.join('\n') + (lines.length ? '\n' : '');

  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  await fs.promises.writeFile(filePath, payload, { mode: 0o600 });

  return filePath;
}

module.exports = {
  DEFAULT_STORE_PATH,
  getStorePath,
  loadFromDiskSync,
  loadToProcessEnv,
  write
};
