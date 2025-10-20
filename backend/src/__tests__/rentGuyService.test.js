const { buildRequiredEnv } = require('../testUtils/env');

const ORIGINAL_ENV = { ...process.env };
const BASE_ENV = buildRequiredEnv();
const ORIGINAL_FETCH = global.fetch;

function buildEnv(overrides = {}) {
  const next = { ...BASE_ENV, ...overrides };
  Object.keys(next).forEach((key) => {
    if (next[key] === undefined) {
      delete next[key];
    }
  });
  return next;
}

function loadService(overrides = {}) {
  jest.resetModules();
  process.env = buildEnv(overrides);
  return require('../services/rentGuyService');
}

describe('rentGuyService', () => {
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    if (ORIGINAL_FETCH) {
      global.fetch = ORIGINAL_FETCH;
    } else {
      delete global.fetch;
    }
  });

  it('fails fast when RentGuy credentials are missing', () => {
    expect(() => loadService({ RENTGUY_API_BASE_URL: undefined, RENTGUY_API_KEY: undefined })).toThrow(
      'Missing required environment variable "RENTGUY_API_BASE_URL" for RentGuy integration (RENTGUY_API_BASE_URL and RENTGUY_API_KEY).'
    );
  });

  it('sends bookings to RentGuy when configured', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValue({ ok: true, status: 201, text: () => Promise.resolve('') });
    global.fetch = fetchMock;

    const rentGuyService = loadService({
      RENTGUY_API_BASE_URL: 'https://rentguy.test/api',
      RENTGUY_API_KEY: 'secret',
      RENTGUY_WORKSPACE_ID: 'workspace-1'
    });
    await rentGuyService.reset();

    const result = await rentGuyService.syncBooking({
      id: 'booking-1',
      status: 'pending',
      eventType: 'Bedrijfsfeest',
      eventDate: '2024-12-10',
      packageId: 'silver',
      name: 'Bob',
      email: 'bob@example.com',
      phone: '+31612345678',
      message: 'Graag voorstel',
      persisted: true
    });

    expect(result).toEqual({ delivered: true, queued: false, queueSize: 0 });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://rentguy.test/api/bookings',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer secret',
          'X-RentGuy-Workspace': 'workspace-1'
        })
      })
    );

    await expect(rentGuyService.getStatus()).resolves.toMatchObject({
      configured: true,
      queueSize: 0,
      lastSyncSuccess: expect.objectContaining({ resource: 'bookings' })
    });
  });

  it('retries queued events via flushQueue', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 500, text: () => Promise.resolve('oops') })
      .mockResolvedValueOnce({ ok: true, status: 200, text: () => Promise.resolve('') });
    global.fetch = fetchMock;

    const rentGuyService = loadService({
      RENTGUY_API_BASE_URL: 'https://rentguy.test/api',
      RENTGUY_API_KEY: 'secret'
    });
    await rentGuyService.reset();

    const syncResult = await rentGuyService.syncLead({
      id: 'lead-2',
      status: 'pending',
      eventType: 'Bruiloft',
      eventDate: '2025-01-01',
      packageId: null,
      name: 'Charlie',
      email: 'charlie@example.com',
      phone: '0612345678',
      message: 'Bel me terug',
      persisted: false
    });

    expect(syncResult).toMatchObject({ delivered: false, queued: true, reason: 'delivery-failed' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await expect(rentGuyService.getStatus()).resolves.toMatchObject({
      queueSize: 1,
      lastSyncError: expect.any(Object)
    });

    const flushResult = await rentGuyService.flushQueue();
    expect(flushResult.configured).toBe(true);
    expect(flushResult.delivered).toBeGreaterThanOrEqual(1);
    expect(flushResult.remaining).toBe(0);
    expect(fetchMock.mock.calls.length).toBeGreaterThanOrEqual(2);
    await expect(rentGuyService.getStatus()).resolves.toMatchObject({
      queueSize: 0,
      lastSyncSuccess: expect.any(Object)
    });
  });

  it('sends personalization events to the dedicated endpoint', async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true, status: 202, text: () => Promise.resolve('') });
    global.fetch = fetchMock;

    const rentGuyService = loadService({
      RENTGUY_API_BASE_URL: 'https://rentguy.test/api',
      RENTGUY_API_KEY: 'secret'
    });
    await rentGuyService.reset();

    const result = await rentGuyService.syncPersonalizationEvent(
      {
        variantId: 'city_eindhoven',
        eventType: 'impression',
        keyword: 'dj eindhoven',
        timestamp: new Date().toISOString()
      },
      { source: 'personalization-pipeline' }
    );

    expect(result).toEqual({ delivered: true, queued: false, queueSize: 0 });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://rentguy.test/api/personalization-events',
      expect.objectContaining({ method: 'POST' })
    );
  });
});
