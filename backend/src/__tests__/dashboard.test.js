const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');

const ORIGINAL_ENV = { ...process.env };

function createAuthHeader(username, password) {
  return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
}

describe('configuration dashboard', () => {
  let server;
  let baseUrl;
  let tempDir;
  let storePath;
  let authHeader;
  let rentGuyService;
  let hubspotService;
  let observabilityService;
  let personalizationService;

  beforeEach(async () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dashboard-test-'));
    storePath = path.join(tempDir, 'managed.env');
    process.env = {
      ...ORIGINAL_ENV,
      CONFIG_DASHBOARD_ENABLED: 'true',
      CONFIG_DASHBOARD_USER: 'admin',
      CONFIG_DASHBOARD_PASS: 'secret',
      CONFIG_DASHBOARD_ALLOWED_IPS: '',
      CONFIG_DASHBOARD_KEYS: 'PORT,DATABASE_URL',
      CONFIG_DASHBOARD_STORE_PATH: storePath
    };

    jest.resetModules();
    const app = require('../app');
    server = http.createServer(app);
    rentGuyService = require('../services/rentGuyService');
    rentGuyService.reset();
    hubspotService = require('../services/hubspotService');
    hubspotService.reset();
    observabilityService = require('../services/observabilityService');
    observabilityService.reset();
    personalizationService = require('../services/personalizationService');
    personalizationService.resetLogs();
    personalizationService.resetCache();

    await new Promise((resolve) => {
      server.listen(0, '127.0.0.1', resolve);
    });

    const address = server.address();
    baseUrl = `http://127.0.0.1:${address.port}`;
    authHeader = createAuthHeader('admin', 'secret');
  });

  afterEach(async () => {
    if (server) {
      await new Promise((resolve) => {
        server.close(resolve);
      });
      server = null;
    }

    fs.rmSync(tempDir, { recursive: true, force: true });
    if (rentGuyService?.reset) {
      rentGuyService.reset();
    }
    if (hubspotService?.reset) {
      hubspotService.reset();
    }
    if (observabilityService?.reset) {
      observabilityService.reset();
    }
    if (personalizationService?.resetLogs) {
      personalizationService.resetLogs();
    }
    process.env = { ...ORIGINAL_ENV };
    jest.resetModules();
  });

  it('requires authentication to access the dashboard', async () => {
    const response = await fetch(`${baseUrl}/dashboard`);

    expect(response.status).toBe(401);
    expect(response.headers.get('www-authenticate')).toMatch(/Basic/i);
  });

  it('renders the dashboard HTML when authenticated', async () => {
    const response = await fetch(`${baseUrl}/dashboard`, {
      headers: {
        Authorization: authHeader
      }
    });

    expect(response.status).toBe(200);
    const body = await response.text();
    expect(body).toContain('Configuration Dashboard');
    expect(body).toContain('Applicatie variabelen');
    expect(body).toContain('E-mailintegratie');
  });

  it('returns the managed configuration state', async () => {
    const response = await fetch(`${baseUrl}/dashboard/api/variables`, {
      headers: {
        Authorization: authHeader,
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
    const updateResponse = await fetch(`${baseUrl}/dashboard/api/variables`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
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

    const fileContents = fs.readFileSync(storePath, 'utf8');
    expect(fileContents).toContain('PORT=4500');
    expect(fileContents).toContain('DATABASE_URL=postgres://dashboard-db');
  });

  it('rejects invalid payloads with a 400 status code', async () => {
    const response = await fetch(`${baseUrl}/dashboard/api/variables`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ entries: ['not', 'an', 'object'] })
    });

    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload).toEqual({ error: 'Invalid payload' });
  });

  it('clears values when empty strings are provided and ignores null', async () => {
    await fetch(`${baseUrl}/dashboard/api/variables`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        entries: {
          PORT: '4500',
          DATABASE_URL: 'postgres://dashboard-db'
        }
      })
    });

    const response = await fetch(`${baseUrl}/dashboard/api/variables`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
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
    expect(portEntry.hasValue).toBe(false);
    expect(portEntry.preview).toBeNull();

    const config = require('../config');
    expect(config.port).toBe(3000);
    expect(config.databaseUrl).toBe('postgres://dashboard-db');
  });

  it('exposes rentguy status through the dashboard API', async () => {
    const response = await fetch(`${baseUrl}/dashboard/api/integrations/rentguy/status`, {
      headers: {
        Authorization: authHeader,
        Accept: 'application/json'
      }
    });

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload).toEqual(
      expect.objectContaining({
        configured: false,
        queueSize: 0
      })
    );
  });

  it('flushes the rentguy queue via the dashboard API', async () => {
    await rentGuyService.syncLead(
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

    const response = await fetch(`${baseUrl}/dashboard/api/integrations/rentguy/flush`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
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
    expect(rentGuyService.getStatus().queueSize).toBe(1);
  });

  it('exposes hubspot status through the dashboard API', async () => {
    const response = await fetch(`${baseUrl}/dashboard/api/integrations/hubspot/status`, {
      headers: {
        Authorization: authHeader,
        Accept: 'application/json'
      }
    });

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload).toEqual(expect.objectContaining({ configured: false, queueSize: 0 }));
  });

  it('exposes monitoring state through the observability endpoint', async () => {
    const response = await fetch(`${baseUrl}/dashboard/api/observability/performance`, {
      headers: {
        Authorization: authHeader,
        Accept: 'application/json'
      }
    });

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(Array.isArray(payload.targets)).toBe(true);
    expect(payload).toHaveProperty('summary');
  });

  it('queues a monitoring run and records the result', async () => {
    const runResponse = await fetch(`${baseUrl}/dashboard/api/observability/performance/run`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
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

    const statusResponse = await fetch(`${baseUrl}/dashboard/api/observability/performance`, {
      headers: {
        Authorization: authHeader,
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
      type: 'conversion',
      variantId,
      keyword: 'bruiloft dj',
      payload: { amount: 1200 },
      context: { source: 'test' }
    });

    const response = await fetch(`${baseUrl}/dashboard/api/observability/variants`, {
      headers: {
        Authorization: authHeader,
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
  });

  it('flushes the hubspot queue via the dashboard API', async () => {
    await hubspotService.submitLead({
      id: 'lead-hubspot-1',
      email: 'queued@example.com',
      firstName: 'Queued'
    });

    const response = await fetch(`${baseUrl}/dashboard/api/integrations/hubspot/flush`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
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
    expect(hubspotService.getStatus().queueSize).toBe(1);
  });
});
