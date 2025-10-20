const app = require('../app');
const { resetInMemoryStore: resetContactStore } = require('../services/contactService');
const { resetInMemoryStore: resetCallbackStore } = require('../services/callbackRequestService');
const { resetInMemoryStore: resetBookingStore } = require('../services/bookingService');
const sevensaService = require('../services/sevensaService');
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

  afterEach(async () => {
    resetContactStore();
    resetCallbackStore();
    resetBookingStore();
    resetPersonalizationLogs();
    resetPersonalizationCache();
    await sevensaService.reset();
  });

  it('returns service metadata on the root route', async () => {
    const response = await request('GET', '/');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
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
    expect(response.body.endpoints.integrations).toEqual(
      expect.objectContaining({
        rentGuy: '/integrations/rentguy/status',
        sevensa: '/integrations/sevensa/status',
        crmExport: '/integrations/crm/export'
      })
    );
    expect(response.body.endpoints.metrics).toBe('/metrics/queues');
    expect(response.body.endpoints.personalization).toEqual(
      expect.objectContaining({
        keyword: '/personalization/keyword',
        events: '/personalization/events'
      })
    );
  });

  it('exports Sevensa CRM queue data as CSV', async () => {
    await sevensaService.reset();
    await sevensaService.submitLead(
      {
        id: 'crm-lead-1',
        firstName: 'Alice',
        lastName: 'DJ',
        email: 'alice@example.com',
        phone: '0612345678',
        message: 'Interested in DJ services',
        eventType: 'wedding',
        eventDate: '2025-06-01'
      },
      { source: 'unit-test' }
    );

    const response = await request('GET', '/integrations/crm/export');

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/csv');
    const lines = response.body.trim().split('\n');
    expect(lines[0]).toBe(
      'lead_id,queue_status,queued_at,attempts,last_error,firstname,lastname,email,phone,company,message,event_date,event_type,budget,page_uri,page_name,source'
    );
    expect(lines.length).toBeGreaterThan(1);
    const columns = lines[1].split(',');
    expect(columns[0]).toBe('crm-lead-1');
    expect(columns[1]).toBe('waiting');
    expect(columns[5]).toBe('Alice');
    expect(columns[6]).toBe('DJ');
    expect(columns[7]).toBe('alice@example.com');
    expect(columns[8]).toBe('0612345678');
    expect(columns[10]).toBe('Interested in DJ services');
    expect(columns[12]).toBe('wedding');
    expect(columns[16]).toBe('unit-test');
  });

  it('exposes a detailed health check', async () => {
    const response = await request('GET', '/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
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
    expect(response.body).toMatchObject({
      success: true,
      persisted: false,
      status: 'pending',
      eventType: 'bruiloft',
      rentGuySync: expect.objectContaining({ queued: true }),
      sevensaSync: expect.objectContaining({ queued: true })
    });
    expect(response.body.callbackId).toBeDefined();
    expect(new Date(response.body.submittedAt).getTime()).toBeGreaterThan(0);
  });

  it('provides queue metrics for observability tooling', async () => {
    const response = await request('GET', '/metrics/queues');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
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
    expect(response.body).toMatchObject({
      error: 'Validatie mislukt'
    });
  });

  it('rejects invalid callback requests', async () => {
    const response = await request('POST', '/callback-request', {});

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({ error: 'Validatie mislukt' });
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
    expect(response.body).toMatchObject({
      success: true,
      persisted: false,
      status: 'pending',
      eventType: 'Bruiloft',
      requestedPackage: 'gold'
    });
    expect(response.body.contactId).toBeDefined();
    expect(new Date(response.body.submittedAt).getTime()).toBeGreaterThan(0);
    expect(new Date(response.body.eventDate).toISOString().startsWith('2024-12-31')).toBe(true);
    expect(response.body.rentGuySync).toEqual(expect.objectContaining({ queued: true }));
    expect(response.body.sevensaSync).toEqual(expect.objectContaining({ queued: true }));
  });

  it('accepts callback requests and queues integrations when no DB is configured', async () => {
    const response = await request('POST', '/callback-request', {
      name: 'Bel mij terug',
      phone: '0612345678',
      eventType: 'bedrijfsfeest'
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      success: true,
      persisted: false,
      status: 'pending',
      eventType: 'bedrijfsfeest'
    });
    expect(response.body.callbackId).toBeDefined();
    expect(response.body.rentGuySync).toEqual(expect.objectContaining({ queued: true }));
    expect(response.body.sevensaSync).toEqual(expect.objectContaining({ queued: true }));
  });

  it('provides a curated set of fallback packages when no database is available', async () => {
    const response = await request('GET', '/packages');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.packages)).toBe(true);
    expect(response.body.packages.length).toBeGreaterThan(0);
    expect(['static', 'content']).toContain(response.body.source);
  });

  it('rejects invalid booking submissions', async () => {
    const response = await request('POST', '/bookings', {});

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({ error: 'Validatie mislukt' });
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
    expect(response.body).toMatchObject({
      success: true,
      persisted: false,
      status: 'pending'
    });
    expect(response.body.bookingId).toBeDefined();
    expect(response.body.rentGuySync).toEqual(expect.objectContaining({ queued: true }));

    const listResponse = await request('GET', '/bookings');
    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toMatchObject({ persisted: false });
    expect(Array.isArray(listResponse.body.bookings)).toBe(true);
    expect(listResponse.body.bookings[0]).toMatchObject({
      name: 'Test Booker',
      eventType: 'Jubileum',
      packageId: 'silver'
    });
  });

  it('exposes approved reviews with a sensible fallback', async () => {
    const response = await request('GET', '/reviews');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.reviews)).toBe(true);
    expect(response.body.reviews.length).toBeGreaterThan(0);
    expect(response.body).toMatchObject({ source: 'static' });
  });

  it('provides integration status for RentGuy', async () => {
    const response = await request('GET', '/integrations/rentguy/status');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      configured: expect.any(Boolean),
      queueSize: expect.any(Number)
    });
  });

  it('provides integration status for Sevensa', async () => {
    const response = await request('GET', '/integrations/sevensa/status');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      configured: expect.any(Boolean),
      queueSize: expect.any(Number)
    });
  });

  it('personalises landing content for wedding keywords', async () => {
    const response = await request('GET', '/personalization/keyword?keyword=bruiloft+dj');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      meta: expect.objectContaining({
        variantId: 'romantic_wedding',
        matchType: 'manual'
      }),
      variant: expect.objectContaining({
        hero: expect.objectContaining({ title: expect.any(String) }),
        pricing: expect.objectContaining({ highlightPackage: 'Zilver' })
      })
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
    expect(response.body).toMatchObject({
      success: true,
      event: expect.objectContaining({
        variantId: 'romantic_wedding',
        type: 'cta_click',
        payload: { cta: 'Plan trouwgesprek' }
      })
    });
  });
});
