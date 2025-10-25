const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const { buildRequiredEnv } = require('../testUtils/env');

const ORIGINAL_ENV = { ...process.env };
const BASE_ENV = buildRequiredEnv();

function createAuthHeader(username, password) {
  return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
}

function writeManagedValues(filePath, values) {
  const entries = Object.entries(values)
    .filter(([key, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${value}`);

  if (!entries.length) {
    fs.writeFileSync(filePath, '');
    return;
  }

  fs.writeFileSync(filePath, `${entries.join('\n')}\n`);
}

async function setupDashboardTest({ env = {}, managedValues = {} } = {}) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dashboard-test-'));
  const storePath = path.join(tempDir, 'managed.env');
  const baseEnv = { ...BASE_ENV, ...env };

  process.env = {
    ...baseEnv,
    CONFIG_DASHBOARD_ENABLED: baseEnv.CONFIG_DASHBOARD_ENABLED ?? 'true',
    CONFIG_DASHBOARD_USER: baseEnv.CONFIG_DASHBOARD_USER ?? 'admin',
    CONFIG_DASHBOARD_PASS: baseEnv.CONFIG_DASHBOARD_PASS ?? 'secret',
    CONFIG_DASHBOARD_ALLOWED_IPS: baseEnv.CONFIG_DASHBOARD_ALLOWED_IPS ?? '',
    CONFIG_DASHBOARD_KEYS: baseEnv.CONFIG_DASHBOARD_KEYS ?? 'PORT,DATABASE_URL',
    CONFIG_DASHBOARD_STORE_PATH: storePath
  };

  writeManagedValues(storePath, managedValues);

  jest.resetModules();

  const app = require('../app');
  const server = http.createServer(app);

  const rentGuyService = require('../services/rentGuyService');
  rentGuyService.reset?.();
  const sevensaService = require('../services/sevensaService');
  sevensaService.reset?.();
  const observabilityService = require('../services/observabilityService');
  observabilityService.reset?.();
  const personalizationService = require('../services/personalizationService');
  personalizationService.resetLogs?.();
  await personalizationService.resetCache?.();

  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });

  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  const credentials = {
    username: process.env.CONFIG_DASHBOARD_USER ?? null,
    password: process.env.CONFIG_DASHBOARD_PASS ?? null
  };

  const context = {
    baseUrl,
    server,
    storePath,
    tempDir,
    credentials,
    authHeader:
      credentials.username && credentials.password
        ? createAuthHeader(credentials.username, credentials.password)
        : null,
    services: {
      rentGuyService,
      sevensaService,
      observabilityService,
      personalizationService
    }
  };

  context.cleanup = async () => {
    if (context.server) {
      await new Promise((resolve) => {
        context.server.close(resolve);
      });
      context.server = null;
    }

    fs.rmSync(context.tempDir, { recursive: true, force: true });

    context.services.rentGuyService.reset?.();
    context.services.sevensaService.reset?.();
    context.services.observabilityService.reset?.();
    context.services.personalizationService.resetLogs?.();
    context.services.personalizationService.resetCache?.();

    process.env = { ...ORIGINAL_ENV };
    jest.resetModules();
  };

  return context;
}

describe('configuration dashboard', () => {
  let context;

  afterEach(async () => {
    if (context) {
      await context.cleanup();
      context = null;
    } else {
      process.env = { ...ORIGINAL_ENV };
      jest.resetModules();
    }
  });

  it('requires authentication to access the dashboard', async () => {
    context = await setupDashboardTest();
    const response = await fetch(`${context.baseUrl}/dashboard`);

    expect(response.status).toBe(401);
    expect(response.headers.get('www-authenticate')).toMatch(/Basic/i);
  });

  it('rejects requests with invalid credentials', async () => {
    context = await setupDashboardTest();
    const response = await fetch(`${context.baseUrl}/dashboard`, {
      headers: {
        Authorization: createAuthHeader('wrong', 'creds')
      }
    });

    expect(response.status).toBe(401);
    expect(response.headers.get('www-authenticate')).toMatch(/Basic/i);
  });

  it('renders the dashboard HTML when authenticated', async () => {
    context = await setupDashboardTest();
    const response = await fetch(`${context.baseUrl}/dashboard`, {
      headers: {
        Authorization: context.authHeader
      }
    });

    expect(response.status).toBe(200);
    const body = await response.text();
    expect(body).toContain('Configuration Dashboard');
    expect(body).toContain('Applicatie variabelen');
    expect(body).toContain('E-mailintegratie');
  });

  it('authenticates using managed environment credentials when runtime env is cleared', async () => {
    context = await setupDashboardTest({
      env: {
        CONFIG_DASHBOARD_USER: undefined,
        CONFIG_DASHBOARD_PASS: undefined
      },
      managedValues: {
        CONFIG_DASHBOARD_USER: 'file-admin',
        CONFIG_DASHBOARD_PASS: 'file-secret'
      }
    });

    delete process.env.CONFIG_DASHBOARD_USER;
    delete process.env.CONFIG_DASHBOARD_PASS;

    const response = await fetch(`${context.baseUrl}/dashboard`, {
      headers: {
        Authorization: createAuthHeader('file-admin', 'file-secret')
      }
    });

    expect(response.status).toBe(200);
  });

  it('returns the managed configuration state', async () => {
    context = await setupDashboardTest();
    const response = await fetch(`${context.baseUrl}/dashboard/api/variables`, {
      headers: {
        Authorization: context.authHeader,
        Accept: 'application/json'
      }
    });

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.managedKeys).toEqual(['PORT', 'DATABASE_URL']);
    expect(Array.isArray(payload.entries)).toBe(true);
    expect(Array.isArray(payload.groups)).toBe(true);
    expect(payload.groups).toEqual([
      expect.objectContaining({
        id: 'application',
        entries: [
          expect.objectContaining({ name: 'PORT' }),
          expect.objectContaining({ name: 'DATABASE_URL' })
        ]
      })
    ]);
  });

  it('persists updates and refreshes runtime configuration', async () => {
    context = await setupDashboardTest();
    const updateResponse = await fetch(`${context.baseUrl}/dashboard/api/variables`, {
      method: 'POST',
      headers: {
        Authorization: context.authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        entries: {
          PORT: '4500',
          DATABASE_URL: 'postgres://dashboard-db'
        }
      })
    });

    expect(updateResponse.status).toBe(200);
    const payload = await updateResponse.json();
    expect(payload.entries.find((entry) => entry.name === 'PORT').hasValue).toBe(true);

    const config = require('../config');
    expect(config.port).toBe(4500);
    expect(config.databaseUrl).toBe('postgres://dashboard-db');

    const fileContents = fs.readFileSync(context.storePath, 'utf8');
    expect(fileContents).toContain('PORT=4500');
    expect(fileContents).toContain('DATABASE_URL=postgres://dashboard-db');
  });

  it('rejects invalid payloads with a 400 status code', async () => {
    context = await setupDashboardTest();
    const response = await fetch(`${context.baseUrl}/dashboard/api/variables`, {
      method: 'POST',
      headers: {
        Authorization: context.authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ entries: ['not', 'an', 'object'] })
    });

    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload).toEqual({ error: 'Invalid payload' });
  });

  it('clears values when empty strings are provided and ignores null', async () => {
    context = await setupDashboardTest();
    await fetch(`${context.baseUrl}/dashboard/api/variables`, {
      method: 'POST',
      headers: {
        Authorization: context.authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        entries: {
          PORT: '4500',
          DATABASE_URL: 'postgres://dashboard-db'
        }
      })
    });

    const response = await fetch(`${context.baseUrl}/dashboard/api/variables`, {
      method: 'POST',
      headers: {
        Authorization: context.authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        entries: {
          PORT: '',
          DATABASE_URL: null
        }
      })
    });

    expect(response.status).toBe(200);

    const payload = await response.json();
    const portEntry = payload.entries.find((entry) => entry.name === 'PORT');
    const databaseUrlEntry = payload.entries.find((entry) => entry.name === 'DATABASE_URL');
    expect(portEntry.hasValue).toBe(false);
    expect(databaseUrlEntry.hasValue).toBe(true);
  });

  it('exposes rentguy status through the dashboard API', async () => {
    context = await setupDashboardTest();
    const response = await fetch(`${context.baseUrl}/dashboard/api/integrations/rentguy/status`, {
      headers: {
        Authorization: context.authHeader,
        Accept: 'application/json'
      }
    });

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload).toEqual(
      expect.objectContaining({
        configured: true,
        queueSize: 0,
        workspaceId: BASE_ENV.RENTGUY_WORKSPACE_ID
      })
    );
  });

  it('flushes the rentguy queue via the dashboard API', async () => {
    context = await setupDashboardTest();
    await context.services.rentGuyService.syncLead(
      {
        id: 'lead-1',
        status: 'pending',
        eventType: 'wedding',
        eventDate: new Date().toISOString(),
        packageId: null,
        name: 'Test Lead',
        email: 'lead@example.com',
        phone: '+31101234567',
        message: 'Test',
        persisted: false
      },
      { source: 'test-suite' }
    );

    const response = await fetch(`${context.baseUrl}/dashboard/api/integrations/rentguy/flush`, {
      method: 'POST',
      headers: {
        Authorization: context.authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.configured).toBe(true);
    expect(payload.attempted).toBeGreaterThanOrEqual(1);
    expect(payload.delivered).toBeGreaterThanOrEqual(0);
    expect(payload.remaining).toBe(0);
    const rentGuyStatus = await rentGuyService.getStatus();
    expect(rentGuyStatus.queueSize).toBe(0);
  });

  it('exposes sevensa status through the dashboard API', async () => {
    context = await setupDashboardTest();
    const response = await fetch(`${context.baseUrl}/dashboard/api/integrations/sevensa/status`, {
      headers: {
        Authorization: context.authHeader,
        Accept: 'application/json'
      }
    });

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload).toEqual(expect.objectContaining({ configured: true, queueSize: 0 }));
  });

  it('flushes the sevensa queue via the dashboard API', async () => {
    context = await setupDashboardTest();
    await context.services.sevensaService.submitLead({
      id: 'lead-sevensa-1',
      email: 'queued@example.com',
      firstName: 'Queued'
    });

    const response = await fetch(`${context.baseUrl}/dashboard/api/integrations/sevensa/flush`, {
      method: 'POST',
      headers: {
        Authorization: context.authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload).toEqual(
      expect.objectContaining({
        configured: false,
        attempted: 0,
        delivered: 0,
        remaining: 1
      })
    );
    const sevensaStatus = await context.services.sevensaService.getStatus();
    expect(sevensaStatus.queueSize).toBe(1);
  });

  it('exposes monitoring state through the observability endpoint', async () => {
    context = await setupDashboardTest();
    const response = await fetch(`${context.baseUrl}/dashboard/api/observability/performance`, {
      headers: {
        Authorization: context.authHeader,
        Accept: 'application/json'
      }
    });

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(Array.isArray(payload.targets)).toBe(true);
    expect(payload).toHaveProperty('summary');
  });

  it('queues a monitoring run and records the result', async () => {
    context = await setupDashboardTest();
    const runResponse = await fetch(`${context.baseUrl}/dashboard/api/observability/performance/run`, {
      method: 'POST',
      headers: {
        Authorization: context.authHeader,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ url: '/pricing', device: 'desktop' })
    });

    expect(runResponse.status).toBe(202);
    const runPayload = await runResponse.json();
    expect(runPayload.scheduled).toBe(true);
    expect(runPayload.entry).toEqual(expect.objectContaining({ url: '/pricing', device: 'desktop' }));

    await new Promise((resolve) => setTimeout(resolve, 120));

    const statusResponse = await fetch(`${context.baseUrl}/dashboard/api/observability/performance`, {
      headers: {
        Authorization: context.authHeader,
        Accept: 'application/json'
      }
    });

    expect(statusResponse.status).toBe(200);
    const statusPayload = await statusResponse.json();
    expect(Array.isArray(statusPayload.runs)).toBe(true);
    expect(statusPayload.runs[0]).toEqual(
      expect.objectContaining({ url: '/pricing', device: 'desktop', metrics: expect.any(Object) })
    );
  });

  it('aggregates variant analytics from personalization logs', async () => {
    context = await setupDashboardTest();
    const personalizationService = context.services.personalizationService;

    const match = await personalizationService.getVariantForRequest({
      keywords: ['bruiloft dj'],
      keyword: 'bruiloft dj'
    });
    const variantId = match.meta?.variantId || 'romantic_wedding';

    await personalizationService.recordEvent({
      type: 'cta_click',
      variantId,
      keyword: 'bruiloft dj',
      payload: {},
      context: { source: 'test' }
    });

    await personalizationService.recordEvent({
      type: 'form_start',
      variantId,
      keyword: 'bruiloft dj',
      payload: {},
      context: { source: 'test' }
    });

    await personalizationService.recordEvent({
      type: 'form_submit',
      variantId,
      keyword: 'bruiloft dj',
      payload: {},
      context: { source: 'test' }
    });

    await personalizationService.recordEvent({
      type: 'conversion',
      variantId,
      keyword: 'bruiloft dj',
      payload: { amount: 1200 },
      context: { source: 'test' }
    });

    const response = await fetch(`${context.baseUrl}/dashboard/api/observability/variants`, {
      headers: {
        Authorization: context.authHeader,
        Accept: 'application/json'
      }
    });

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(Array.isArray(payload.variants)).toBe(true);
    const wedding = payload.variants.find((variant) => variant.variantId === variantId);
    expect(wedding).toBeDefined();
    expect(wedding.exposures).toBeGreaterThan(0);
    expect(wedding.conversions).toBeGreaterThanOrEqual(1);
    expect(wedding.formStarts).toBeGreaterThanOrEqual(1);
    expect(wedding.formSubmits).toBeGreaterThanOrEqual(1);
  });

  it('exposes conversion metrics through the dashboard API', async () => {
    const match = await personalizationService.getVariantForRequest({
      keywords: ['feest dj'],
      keyword: 'feest dj'
    });
    const variantId = match.meta?.variantId || 'romantic_wedding';

    await personalizationService.recordEvent({
      type: 'cta_click',
      variantId,
      keyword: 'feest dj',
      payload: {},
      context: { source: 'test' }
    });

    await personalizationService.recordEvent({
      type: 'form_start',
      variantId,
      keyword: 'feest dj',
      payload: {},
      context: { source: 'test' }
    });

    await personalizationService.recordEvent({
      type: 'form_submit',
      variantId,
      keyword: 'feest dj',
      payload: {},
      context: { source: 'test' }
    });

    await personalizationService.recordEvent({
      type: 'conversion',
      variantId,
      keyword: 'feest dj',
      payload: { revenue: 950 },
      context: { source: 'test' }
    });

    const response = await fetch(`${baseUrl}/dashboard/api/observability/conversions`, {
      headers: {
        Authorization: authHeader,
        Accept: 'application/json'
      }
    });

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload).toHaveProperty('totals');
    expect(payload.totals.conversionEvents).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(payload.funnel)).toBe(true);
    expect(Array.isArray(payload.recentConversions)).toBe(true);
    expect(payload.topVariants[0]).toEqual(
      expect.objectContaining({ variantId, conversions: expect.any(Number) })
    );
  });

  it('flushes the sevensa queue via the dashboard API', async () => {
    await sevensaService.submitLead({
      id: 'lead-sevensa-1',
      email: 'queued@example.com',
      firstName: 'Queued'
    });

    const response = await fetch(`${baseUrl}/dashboard/api/integrations/sevensa/flush`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.configured).toBe(true);
    expect(payload.attempted).toBeGreaterThanOrEqual(1);
    expect(payload.delivered).toBeGreaterThanOrEqual(0);
    expect(payload.remaining).toBe(0);
    const sevensaStatus = await sevensaService.getStatus();
    expect(sevensaStatus.queueSize).toBe(0);
  });
});
