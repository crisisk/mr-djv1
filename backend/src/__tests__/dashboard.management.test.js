const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const express = require('express');
const request = require('supertest');
const { buildRequiredEnv } = require('../testUtils/env');

const ORIGINAL_ENV = { ...process.env };

function createAuthHeader(username, password) {
  return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
}

describe('dashboard management route validations', () => {
  let server;
  let agent;
  let authHeader;
  let tempDir;
  let configDashboardService;
  let rentGuyService;
  let sevensaService;
  let observabilityService;

  beforeEach(async () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dashboard-mgmt-'));
    const storePath = path.join(tempDir, 'managed.env');

    process.env = {
      ...buildRequiredEnv(),
      CONFIG_DASHBOARD_ENABLED: 'true',
      CONFIG_DASHBOARD_USER: 'admin',
      CONFIG_DASHBOARD_PASS: 'secret',
      CONFIG_DASHBOARD_ALLOWED_IPS: '',
      CONFIG_DASHBOARD_KEYS: 'PORT,DATABASE_URL',
      CONFIG_DASHBOARD_STORE_PATH: storePath
    };

    jest.resetModules();

    jest.doMock('../services/configDashboardService', () => {
      return {
        getState: jest.fn().mockResolvedValue({
          managedKeys: ['PORT', 'DATABASE_URL'],
          entries: [],
          groups: [],
          metadata: {}
        }),
        updateValues: jest.fn().mockResolvedValue({
          managedKeys: ['PORT', 'DATABASE_URL'],
          entries: [],
          groups: [],
          metadata: {}
        }),
        listRoles: jest.fn().mockResolvedValue([]),
        createRole: jest.fn().mockResolvedValue({}),
        updateRole: jest.fn().mockResolvedValue({}),
        deleteRole: jest.fn().mockResolvedValue({})
      };
    });

    jest.doMock('../services/rentGuyService', () => ({
      getStatus: jest.fn().mockResolvedValue({}),
      flushQueue: jest.fn().mockResolvedValue({
        configured: true,
        attempted: 1,
        delivered: 1,
        remaining: 0
      })
    }));

    jest.doMock('../services/sevensaService', () => ({
      getStatus: jest.fn().mockResolvedValue({}),
      flushQueue: jest.fn().mockResolvedValue({
        configured: true,
        attempted: 0,
        delivered: 0,
        remaining: 0
      })
    }));

    jest.doMock('../services/observabilityService', () => ({
      getMonitoringState: jest.fn().mockResolvedValue({
        queue: [],
        runs: [],
        targets: [],
        summary: {}
      }),
      scheduleRun: jest.fn().mockResolvedValue({
        id: 'run_1',
        url: '/pricing',
        device: 'desktop',
        trigger: 'dashboard',
        tools: ['lighthouse', 'axe'],
        status: 'queued',
        requestedAt: new Date().toISOString()
      }),
      getVariantAnalytics: jest.fn().mockResolvedValue({ variants: [] })
    }));

    jest.doMock('../lib/featureFlags', () => ({
      refreshIfNeeded: jest.fn().mockResolvedValue(),
      getAll: jest.fn().mockResolvedValue({}),
      isEnabled: jest.fn().mockReturnValue(true),
      guard: () => (_req, _res, next) => next()
    }));

    jest.doMock('../lib/logger', () => ({
      logger: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
        child: () => ({
          info: jest.fn(),
          warn: jest.fn(),
          error: jest.fn(),
          debug: jest.fn()
        })
      }
    }));

    jest.doMock('../middleware/dashboardAuth', () => (_req, _res, next) => next());

    const dashboardRouter = require('../routes/dashboard');
    const app = express();
    app.use(express.json());
    app.use('/dashboard', dashboardRouter);
    configDashboardService = require('../services/configDashboardService');
    rentGuyService = require('../services/rentGuyService');
    sevensaService = require('../services/sevensaService');
    observabilityService = require('../services/observabilityService');

    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    agent = request(server);
    authHeader = createAuthHeader('admin', 'secret');
  });

  afterEach(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
      server = null;
    }

    if (tempDir) {
      fs.rmSync(tempDir, { recursive: true, force: true });
      tempDir = null;
    }

    process.env = { ...ORIGINAL_ENV };
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('accepts valid configuration updates', async () => {
    configDashboardService.updateValues.mockResolvedValue({
      managedKeys: ['PORT'],
      entries: [{ name: 'PORT', hasValue: true }],
      groups: [],
      metadata: {}
    });

    const response = await agent
      .post('/dashboard/api/variables')
      .set('Authorization', authHeader)
      .send({ entries: { PORT: '4500' } });

    expect(response.status).toBe(200);
    expect(configDashboardService.updateValues).toHaveBeenCalledWith({ PORT: '4500' }, { assignments: undefined });
    expect(response.body).toEqual({
      managedKeys: ['PORT'],
      entries: [{ name: 'PORT', hasValue: true }],
      groups: [],
      metadata: {}
    });
  });

  it('rejects invalid configuration payloads', async () => {
    const response = await agent
      .post('/dashboard/api/variables')
      .set('Authorization', authHeader)
      .send({ entries: ['not', 'an', 'object'] });

    expect(response.status).toBe(422);
    expect(response.body).toEqual(
      expect.objectContaining({
        error: 'Validatie mislukt',
        details: expect.arrayContaining([
          expect.objectContaining({ field: 'entries', message: 'entries moet een object zijn' })
        ])
      })
    );
    expect(configDashboardService.updateValues).not.toHaveBeenCalled();
  });

  it('rejects unknown configuration keys', async () => {
    const response = await agent
      .post('/dashboard/api/variables')
      .set('Authorization', authHeader)
      .send({ entries: { UNKNOWN_KEY: 'value' } });

    expect(response.status).toBe(422);
    expect(response.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: expect.stringContaining('Onbekende configuratiesleutels') })
      ])
    );
    expect(configDashboardService.updateValues).not.toHaveBeenCalled();
  });

  it('flushes the RentGuy queue with a validated limit', async () => {
    rentGuyService.flushQueue.mockResolvedValue({ configured: true, attempted: 2, delivered: 2, remaining: 0 });

    const response = await agent
      .post('/dashboard/api/integrations/rentguy/flush')
      .set('Authorization', authHeader)
      .send({ limit: '25' });

    expect(response.status).toBe(200);
    expect(rentGuyService.flushQueue).toHaveBeenCalledWith(25);
    expect(response.body).toEqual({ configured: true, attempted: 2, delivered: 2, remaining: 0 });
  });

  it('rejects invalid RentGuy flush limits', async () => {
    const response = await agent
      .post('/dashboard/api/integrations/rentguy/flush')
      .set('Authorization', authHeader)
      .send({ limit: 0 });

    expect(response.status).toBe(422);
    expect(response.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: expect.stringContaining('limit moet een geheel getal') })
      ])
    );
    expect(rentGuyService.flushQueue).not.toHaveBeenCalled();
  });

  it('flushes the Sevensa queue when no limit is provided', async () => {
    const response = await agent
      .post('/dashboard/api/integrations/sevensa/flush')
      .set('Authorization', authHeader)
      .send({});

    expect(response.status).toBe(200);
    expect(sevensaService.flushQueue).toHaveBeenCalledWith(undefined);
  });

  it('rejects Sevensa flush requests with unknown fields', async () => {
    const response = await agent
      .post('/dashboard/api/integrations/sevensa/flush')
      .set('Authorization', authHeader)
      .send({ limit: 5, extra: true });

    expect(response.status).toBe(422);
    expect(response.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: expect.stringContaining('Onbekende velden') })
      ])
    );
    expect(sevensaService.flushQueue).not.toHaveBeenCalled();
  });

  it('schedules observability runs with validated payloads', async () => {
    observabilityService.scheduleRun.mockResolvedValue({
      id: 'run_42',
      url: '/landing',
      device: 'mobile',
      trigger: 'dashboard',
      tools: ['lighthouse'],
      status: 'queued',
      requestedAt: new Date().toISOString()
    });

    const response = await agent
      .post('/dashboard/api/observability/performance/run')
      .set('Authorization', authHeader)
      .send({ url: '/landing', device: 'Mobile', variantId: ' variant-123 ', tools: ['Lighthouse', 'lighthouse'] });

    expect(response.status).toBe(202);
    expect(observabilityService.scheduleRun).toHaveBeenCalledWith({
      url: '/landing',
      device: 'mobile',
      variantId: 'variant-123',
      trigger: 'dashboard',
      tools: ['lighthouse']
    });
    expect(response.body).toEqual({
      scheduled: true,
      entry: {
        id: 'run_42',
        url: '/landing',
        device: 'mobile',
        trigger: 'dashboard',
        tools: ['lighthouse'],
        status: 'queued',
        requestedAt: expect.any(String)
      }
    });
  });

  it('rejects observability runs with invalid tools', async () => {
    const response = await agent
      .post('/dashboard/api/observability/performance/run')
      .set('Authorization', authHeader)
      .send({ url: '/landing', tools: ['axe', 'seo'] });

    expect(response.status).toBe(422);
    expect(response.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: expect.stringContaining('tools bevat onbekende waarden') })
      ])
    );
    expect(observabilityService.scheduleRun).not.toHaveBeenCalled();
  });
});
