const { Pool } = require('pg');
const config = require('../config');

let pool;

const state = {
  configured: Boolean(config.databaseUrl),
  connected: false,
  lastError: null,
  lastSuccessfulAt: null,
  lastFailureAt: null
};

function createPool() {
  if (!state.configured) {
    return null;
  }

  if (pool) {
    return pool;
  }

  pool = new Pool({
    connectionString: config.databaseUrl,
    ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined
  });

  pool.on('error', (error) => {
    state.connected = false;
    state.lastError = error.message;
    state.lastFailureAt = new Date();
    console.error('[db] Unexpected database error:', error);
  });

  // Perform a lazy verification so we know if the pool is reachable.
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
  return state.configured;
}

function getStatus() {
  return { ...state };
}

module.exports = {
  getPool,
  runQuery,
  isConfigured,
  getStatus
};
