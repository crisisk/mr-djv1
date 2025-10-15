const { Pool } = require('pg');
const config = require('../config');

let pool;
let currentConnectionString;

const state = {
  configured: Boolean(config.databaseUrl),
  connected: false,
  lastError: null,
  lastSuccessfulAt: null,
  lastFailureAt: null
};

function refreshConfiguration() {
  const nextConnectionString = config.databaseUrl;
  state.configured = Boolean(nextConnectionString);

  if (!state.configured) {
    if (pool) {
      pool.end().catch((error) => {
        console.warn('[db] Failed to close pool during configuration refresh:', error.message);
      });
      pool = null;
    }
    currentConnectionString = undefined;
    state.connected = false;
    return false;
  }

  if (currentConnectionString && currentConnectionString !== nextConnectionString && pool) {
    pool.end().catch((error) => {
      console.warn('[db] Failed to close pool after configuration update:', error.message);
    });
    pool = null;
    state.connected = false;
  }

  currentConnectionString = nextConnectionString;
  return true;
}

function createPool() {
  if (!refreshConfiguration()) {
    return null;
  }

  if (pool) {
    return pool;
  }

  pool = new Pool({
    connectionString: currentConnectionString,
    ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined
  });

  pool.on('error', (error) => {
    state.connected = false;
    state.lastError = error.message;
    state.lastFailureAt = new Date();
    console.error('[db] Unexpected database error:', error);
  });

  pool
    .connect()
    .then((client) => {
      state.connected = true;
      state.lastError = null;
      state.lastSuccessfulAt = new Date();
      client.release();
    })
    .catch((error) => {
      state.connected = false;
      state.lastError = error.message;
      state.lastFailureAt = new Date();
      console.warn('[db] Initial database connection failed:', error.message);
    });

  return pool;
}

function getPool() {
  return createPool();
}

function recordSuccess() {
  state.connected = true;
  state.lastError = null;
  state.lastSuccessfulAt = new Date();
}

function recordFailure(error) {
  state.connected = false;
  state.lastError = error.message;
  state.lastFailureAt = new Date();
}

async function runQuery(text, params = []) {
  const activePool = getPool();

  if (!activePool) {
    return null;
  }

  try {
    const result = await activePool.query(text, params);
    recordSuccess();
    return result;
  } catch (error) {
    recordFailure(error);
    throw error;
  }
}

function isConfigured() {
  refreshConfiguration();
  return state.configured;
}

function getStatus() {
  refreshConfiguration();
  return { ...state };
}

module.exports = {
  getPool,
  runQuery,
  isConfigured,
  getStatus
};
