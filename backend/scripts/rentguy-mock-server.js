#!/usr/bin/env node
const express = require('express');

function resolveNumber(value, fallback) {
  if (value === undefined || value === null) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function createRentGuyMockServer(options = {}) {
  const {
    apiKey = process.env.RENTGUY_MOCK_API_KEY || process.env.RENTGUY_API_KEY || 'mock-api-key',
    workspaceId = process.env.RENTGUY_MOCK_WORKSPACE_ID || process.env.RENTGUY_WORKSPACE_ID || null,
    logger = console
  } = options;

  if (!apiKey) {
    throw new Error('RentGuy mock server requires an API key (set RENTGUY_MOCK_API_KEY or RENTGUY_API_KEY).');
  }

  const state = {
    bookings: [],
    leads: [],
    personalizationEvents: [],
    lastDelivery: null,
    lastError: null
  };

  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', deliveries: countDeliveries(state) });
  });

  app.use((req, res, next) => {
    if (req.path === '/health') {
      next();
      return;
    }

    const authHeader = req.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'missing-auth', message: 'Provide Bearer token via Authorization header.' });
      return;
    }

    const token = authHeader.slice('Bearer '.length);

    if (token !== apiKey) {
      res.status(403).json({ error: 'invalid-api-key', message: 'Provided API key is not accepted by the mock service.' });
      return;
    }

    if (workspaceId) {
      const workspaceHeader = req.get('x-rentguy-workspace');
      if (!workspaceHeader) {
        res.status(400).json({
          error: 'missing-workspace',
          message: 'Include X-RentGuy-Workspace header when the mock server is configured for a workspace.'
        });
        return;
      }

      if (workspaceHeader !== workspaceId) {
        res.status(409).json({
          error: 'workspace-mismatch',
          message: `Workspace header (${workspaceHeader}) does not match configured workspace (${workspaceId}).`
        });
        return;
      }
    }

    const simulation = req.get('x-rentguy-simulate');
    if (simulation) {
      handleSimulation(simulation, req, res, state, logger);
      return;
    }

    next();
  });

  app.post('/bookings', (req, res) => {
    state.bookings.push({ ...req.body, receivedAt: new Date().toISOString() });
    state.lastDelivery = {
      resource: 'booking',
      status: 201,
      payload: req.body,
      receivedAt: new Date().toISOString()
    };
    logger.info?.('[rentguy-mock] booking received');
    res.status(201).json({ delivered: true });
  });

  app.post('/leads', (req, res) => {
    state.leads.push({ ...req.body, receivedAt: new Date().toISOString() });
    state.lastDelivery = {
      resource: 'lead',
      status: 202,
      payload: req.body,
      receivedAt: new Date().toISOString()
    };
    logger.info?.('[rentguy-mock] lead received');
    res.status(202).json({ delivered: true });
  });

  app.post('/personalization-events', (req, res) => {
    state.personalizationEvents.push({ ...req.body, receivedAt: new Date().toISOString() });
    state.lastDelivery = {
      resource: 'personalization-event',
      status: 202,
      payload: req.body,
      receivedAt: new Date().toISOString()
    };
    logger.info?.('[rentguy-mock] personalization event received');
    res.status(202).json({ delivered: true });
  });

  app.get('/status', (_req, res) => {
    res.json({
      configured: true,
      deliveries: {
        bookings: state.bookings.length,
        leads: state.leads.length,
        personalizationEvents: state.personalizationEvents.length
      },
      lastDelivery: state.lastDelivery,
      lastError: state.lastError
    });
  });

  app.post('/reset', (_req, res) => {
    state.bookings = [];
    state.leads = [];
    state.personalizationEvents = [];
    state.lastDelivery = null;
    state.lastError = null;
    res.status(204).end();
  });

  app.get('/deliveries', (_req, res) => {
    res.json({
      bookings: state.bookings,
      leads: state.leads,
      personalizationEvents: state.personalizationEvents
    });
  });

  return { app, state };
}

function handleSimulation(simulation, req, res, state, logger) {
  switch (simulation) {
    case 'auth-error':
      res.status(401).json({ error: 'invalid-auth-simulation', message: 'Simulated authentication failure.' });
      return;
    case 'rate-limit':
      res.status(429).json({ error: 'rate-limit', message: 'Simulated rate limiting triggered.' });
      state.lastError = {
        resource: req.path.replace('/', ''),
        status: 429,
        message: 'Rate limit simulated',
        occurredAt: new Date().toISOString()
      };
      logger.warn?.('[rentguy-mock] simulated rate limit triggered');
      return;
    case 'server-error':
      res.status(500).json({ error: 'server-error', message: 'Simulated upstream failure.' });
      state.lastError = {
        resource: req.path.replace('/', ''),
        status: 500,
        message: 'Server error simulated',
        occurredAt: new Date().toISOString()
      };
      logger.error?.('[rentguy-mock] simulated server error triggered');
      return;
    default:
      res.status(400).json({ error: 'unknown-simulation', message: `Unsupported simulation mode: ${simulation}` });
  }
}

function countDeliveries(state) {
  return state.bookings.length + state.leads.length + state.personalizationEvents.length;
}

async function start() {
  const { app } = createRentGuyMockServer();
  const port = resolveNumber(process.env.RENTGUY_MOCK_PORT || process.env.PORT, 5050);
  const host = process.env.RENTGUY_MOCK_HOST || '127.0.0.1';

  return new Promise((resolve, reject) => {
    const server = app
      .listen(port, host, () => {
        console.log(`[rentguy-mock] listening on http://${host}:${port}`);
        resolve(server);
      })
      .on('error', (error) => {
        console.error('[rentguy-mock] failed to start:', error.message);
        reject(error);
      });
  });
}

if (require.main === module) {
  start().catch((error) => {
    process.exitCode = 1;
    console.error(error);
  });
}

module.exports = {
  createRentGuyMockServer,
  start
};
