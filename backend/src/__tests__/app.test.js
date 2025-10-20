const app = require('../app');
const { resetInMemoryStore: resetContactStore } = require('../services/contactService');
const { resetInMemoryStore: resetCallbackStore } = require('../services/callbackRequestService');
const { resetInMemoryStore: resetBookingStore } = require('../services/bookingService');
const {
  resetLogs: resetPersonalizationLogs,
  resetCache: resetPersonalizationCache
} = require('../services/personalizationService');
const http = require('http');

let server;
let baseUrl;

function request(method, path, body, headers = {}) {
  const url = new URL(path, baseUrl);
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  if (body) {
    options.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  return fetch(url, options).then(async (response) => {
    const rawBody = await response.text();
    let parsedBody;

    if (!rawBody) {
      parsedBody = undefined;
    } else {
      try {
        parsedBody = JSON.parse(rawBody);
      } catch (_error) {
        parsedBody = rawBody;
      }
    }

    return {
      status: response.status,
      body: parsedBody,
      headers: response.headers
    };
  });
}

describe('Mister DJ API', () => {
  beforeAll((done) => {
    server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      baseUrl = `http://127.0.0.1:${address.port}`;
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  afterEach(() => {
    resetContactStore();
    resetCallbackStore();
    resetBookingStore();
    resetPersonalizationLogs();
    resetPersonalizationCache();
  });

  it('returns service metadata on the root route', async () => {
    const response = await request('GET', '/');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      message: 'Mister DJ API',
      endpoints: expect.objectContaining({
        health: '/health',
        contact: '/contact',
        callbackRequest: '/callback-request',
        packages: '/packages',
        bookings: '/bookings',
        reviews: '/reviews'
      })
    });
    const endpoints = response.body.data.endpoints;
    expect(endpoints.integrations).toEqual(
      expect.objectContaining({
        rentGuy: '/integrations/rentguy/status',
        sevensa: '/integrations/sevensa/status'
      })
    );
    expect(endpoints.metrics).toBe('/metrics/queues');
    expect(endpoints.personalization).toEqual(
      expect.objectContaining({
        keyword: '/personalization/keyword',
        events: '/personalization/events'
      })
    );
  });

  it('exposes a detailed health check', async () => {
    const response = await request('GET', '/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      status: 'ok',
      service: expect.any(String),
      dependencies: expect.objectContaining({
        database: expect.objectContaining({
          configured: expect.any(Boolean),
          connected: expect.any(Boolean)
        }),
        storage: expect.objectContaining({
          contact: expect.objectContaining({ strategy: expect.any(String) }),
          callbackRequests: expect.objectContaining({ strategy: expect.any(String) }),
          bookings: expect.objectContaining({ strategy: expect.any(String) })
        })
      })
    });
  });

  it('accepts callback requests and returns integration statuses', async () => {
    const response = await request('POST', '/callback-request', {
      name: 'Test Caller',
      phone: '0612345678',
      eventType: 'bruiloft'
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.meta).toMatchObject({
      message: expect.stringContaining('Bedankt')
    });
    expect(response.body.data).toMatchObject({
      persisted: false,
      status: 'pending',
      eventType: 'bruiloft',
      rentGuySync: expect.objectContaining({ queued: true }),
      sevensaSync: expect.objectContaining({ queued: true })
    });
    expect(response.body.data.callbackId).toBeDefined();
    expect(new Date(response.body.data.submittedAt).getTime()).toBeGreaterThan(0);
  });

  it('provides queue metrics for observability tooling', async () => {
    const response = await request('GET', '/metrics/queues');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(
      expect.objectContaining({
        generatedAt: expect.any(String),
        queues: expect.objectContaining({
          rentguy: expect.objectContaining({
            configured: expect.any(Boolean),
            queueSize: expect.any(Number),
            activeJobs: expect.any(Number),
            retryAgeP95: expect.any(Number),
            counts: expect.any(Object)
          }),
          sevensa: expect.objectContaining({
            configured: expect.any(Boolean),
            queueSize: expect.any(Number),
            activeJobs: expect.any(Number),
            retryAgeP95: expect.any(Number),
            counts: expect.any(Object)
          })
        })
      })
    );
  });

  it('rejects invalid contact submissions', async () => {
    const response = await request('POST', '/contact', {});

    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
    expect(response.body.meta).toMatchObject({ message: 'Validatie mislukt' });
    expect(Array.isArray(response.body.data.details)).toBe(true);
  });

  it('rejects invalid callback requests', async () => {
    const response = await request('POST', '/callback-request', {});

    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
    expect(response.body.meta).toMatchObject({ message: 'Validatie mislukt' });
    expect(Array.isArray(response.body.data.details)).toBe(true);
  });

  it('returns a helpful error when the JSON payload cannot be parsed', async () => {
    const response = await request('POST', '/contact', '{"name": "Test"', {
      'Content-Type': 'application/json'
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: 'Ongeldige JSON payload'
    });
  });

  it('accepts contact submissions and stores them in memory when no DB is configured', async () => {
    const response = await request('POST', '/contact', {
      name: 'Test User',
      email: 'test@example.com',
      phone: '0612345678',
      message: 'Ik heb interesse in het gouden pakket.',
      eventType: 'Bruiloft',
      eventDate: '2024-12-31',
      packageId: 'gold'
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.meta).toMatchObject({
      message: expect.stringContaining('Bedankt')
    });
    expect(response.body.data).toMatchObject({
      persisted: false,
      status: 'pending',
      eventType: 'Bruiloft',
      requestedPackage: 'gold',
      rentGuySync: expect.objectContaining({ queued: true }),
      sevensaSync: expect.objectContaining({ queued: true })
    });
    expect(response.body.data.contactId).toBeDefined();
    expect(new Date(response.body.data.submittedAt).getTime()).toBeGreaterThan(0);
    expect(new Date(response.body.data.eventDate).toISOString().startsWith('2024-12-31')).toBe(true);
  });

  it('accepts callback requests and queues integrations when no DB is configured', async () => {
    const response = await request('POST', '/callback-request', {
      name: 'Bel mij terug',
      phone: '0612345678',
      eventType: 'bedrijfsfeest'
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.meta).toMatchObject({ message: expect.any(String) });
    expect(response.body.data).toMatchObject({
      persisted: false,
      status: 'pending',
      eventType: 'bedrijfsfeest',
      rentGuySync: expect.objectContaining({ queued: true }),
      sevensaSync: expect.objectContaining({ queued: true })
    });
    expect(response.body.data.callbackId).toBeDefined();
  });

  it('provides a curated set of fallback packages when no database is available', async () => {
    const response = await request('GET', '/packages');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data.packages)).toBe(true);
    expect(response.body.data.packages.length).toBeGreaterThan(0);
    expect(['static', 'content']).toContain(response.body.meta.source);
  });

  it('rejects invalid booking submissions', async () => {
    const response = await request('POST', '/bookings', {});

    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
    expect(response.body.meta).toMatchObject({ message: 'Validatie mislukt' });
    expect(Array.isArray(response.body.data.details)).toBe(true);
  });

  it('creates bookings and tracks them in memory when the database is unavailable', async () => {
    const response = await request('POST', '/bookings', {
      name: 'Test Booker',
      email: 'booker@example.com',
      phone: '0612345678',
      eventType: 'Jubileum',
      eventDate: '2025-06-15',
      message: 'Wij willen graag het zilveren pakket.',
      packageId: 'silver'
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.meta).toMatchObject({
      message: expect.stringContaining('Bedankt')
    });
    expect(response.body.data).toMatchObject({
      persisted: false,
      status: 'pending',
      rentGuySync: expect.objectContaining({ queued: true })
    });
    expect(response.body.data.bookingId).toBeDefined();

    const listResponse = await request('GET', '/bookings');
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.success).toBe(true);
    expect(listResponse.body.meta).toMatchObject({ persisted: false });
    expect(Array.isArray(listResponse.body.data.bookings)).toBe(true);
    expect(listResponse.body.data.bookings[0]).toMatchObject({
      name: 'Test Booker',
      eventType: 'Jubileum',
      packageId: 'silver'
    });
  });

  it('exposes approved reviews with a sensible fallback', async () => {
    const response = await request('GET', '/reviews');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data.reviews)).toBe(true);
    expect(response.body.data.reviews.length).toBeGreaterThan(0);
    expect(response.body.meta).toMatchObject({ source: expect.any(String) });
  });

  it('provides integration status for RentGuy', async () => {
    const response = await request('GET', '/integrations/rentguy/status');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      configured: expect.any(Boolean),
      queueSize: expect.any(Number)
    });
  });

  it('provides integration status for Sevensa', async () => {
    const response = await request('GET', '/integrations/sevensa/status');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      configured: expect.any(Boolean),
      queueSize: expect.any(Number)
    });
  });

  it('personalises landing content for wedding keywords', async () => {
    const response = await request('GET', '/personalization/keyword?keyword=bruiloft+dj');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.meta).toMatchObject({
      variantId: 'romantic_wedding',
      matchType: 'manual'
    });
    expect(response.body.data).toMatchObject({
      hero: expect.objectContaining({ title: expect.any(String) }),
      pricing: expect.objectContaining({ highlightPackage: 'Zilver' })
    });
  });

  it('records personalization events for CRO analytics', async () => {
    const response = await request('POST', '/personalization/events', {
      type: 'cta_click',
      variantId: 'romantic_wedding',
      keyword: 'bruiloft dj',
      payload: { cta: 'Plan trouwgesprek' }
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      event: expect.objectContaining({
        variantId: 'romantic_wedding',
        type: 'cta_click',
        payload: { cta: 'Plan trouwgesprek' }
      })
    });
  });
});
