const { buildRequiredEnv } = require('../testUtils/env');

const ORIGINAL_ENV = { ...process.env };
process.env = { ...ORIGINAL_ENV, ...buildRequiredEnv() };

jest.mock('../lib/db', () => ({
  isConfigured: jest.fn(() => false),
  runQuery: jest.fn(),
  getStatus: jest.fn(() => ({
    connected: false,
    lastError: null,
    lastSuccessfulAt: null,
    lastFailureAt: null
  }))
}));

jest.mock('../services/rentGuyService', () => ({
  syncLead: jest.fn(() =>
    Promise.resolve({ delivered: false, queued: true, reason: 'not-configured', queueSize: 1 })
  ),
  syncBooking: jest.fn(() =>
    Promise.resolve({ delivered: false, queued: true, reason: 'not-configured', queueSize: 1 })
  ),
  getStatus: jest.fn(() => ({ configured: false, queueSize: 0 })),
  flushQueue: jest.fn(),
  reset: jest.fn()
}));

jest.mock('../services/sevensaService', () => ({
  submitLead: jest.fn(() =>
    Promise.resolve({ delivered: false, queued: true, reason: 'not-configured', queueSize: 1 })
  ),
  getStatus: jest.fn(() => ({ configured: false, queueSize: 0, deadLetterCount: 0 })),
  flushQueue: jest.fn(),
  reset: jest.fn()
}));

const db = require('../lib/db');
const cache = require('../lib/cache');
const config = require('../config');
const contactService = require('../services/contactService');
const callbackRequestService = require('../services/callbackRequestService');
const bookingService = require('../services/bookingService');
const packageService = require('../services/packageService');
const reviewService = require('../services/reviewService');
const rentGuyService = require('../services/rentGuyService');
const sevensaService = require('../services/sevensaService');

function mockConsole(method = 'error') {
  return jest.spyOn(console, method).mockImplementation(() => {});
}

describe('contactService', () => {
  beforeEach(() => {
    config.integrations = config.integrations || {};
    config.integrations.hcaptcha = {
      enabled: false,
      siteKey: null,
      secretKey: null,
      verifyUrl: 'https://hcaptcha.com/siteverify'
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    contactService.resetInMemoryStore();
    callbackRequestService.resetInMemoryStore();
  });

  it('persists contact submissions in the database when configured', async () => {
    const createdAt = new Date('2024-01-01T10:00:00Z');
    db.isConfigured.mockReturnValueOnce(true);
    db.runQuery.mockResolvedValueOnce({
      rows: [
        {
          id: 'db-id',
          status: 'new',
          createdAt,
          eventType: null,
          eventDate: null,
          packageId: null
        }
      ]
    });
    rentGuyService.syncLead.mockResolvedValueOnce({ delivered: true, queued: false, queueSize: 0 });
    sevensaService.submitLead.mockResolvedValueOnce({ delivered: true, queued: false, queueSize: 0 });

    const result = await contactService.saveContact({
      name: 'Test',
      email: 'test@example.com',
      phone: '0612345678',
      message: 'Hallo',
      eventType: 'Bruiloft',
      eventDate: '2024-05-20',
      packageId: 'gold'
    });

    expect(result).toMatchObject({
      id: 'db-id',
      status: 'new',
      persisted: true,
      eventType: 'Bruiloft',
      packageId: 'gold',
      rentGuySync: { delivered: true, queued: false },
      sevensaSync: { delivered: true, queued: false }
    });
    expect(db.runQuery).toHaveBeenCalled();
    expect(rentGuyService.syncLead).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'db-id',
        name: 'Test',
        email: 'test@example.com'
      }),
      expect.objectContaining({
        source: 'contact-form',
        attemptId: expect.any(String)
      })
    );
    expect(sevensaService.submitLead).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'db-id',
        email: 'test@example.com',
        eventType: 'Bruiloft'
      }),
      expect.objectContaining({
        source: 'contact-form',
        attemptId: expect.any(String)
      })
    );
  });

  it('falls back to in-memory storage when the database fails', async () => {
    db.isConfigured.mockReturnValueOnce(true);
    db.runQuery.mockRejectedValueOnce(new Error('insert failed'));
    const errorSpy = mockConsole('error');

    const result = await contactService.saveContact({
      name: 'Fallback',
      email: 'fallback@example.com',
      phone: '0612345678',
      message: 'Fallback message',
      eventType: 'Event',
      eventDate: 'invalid-date'
    });

    expect(errorSpy).toHaveBeenCalled();
    expect(result).toMatchObject({
      status: 'pending',
      persisted: false,
      eventDate: null,
      rentGuySync: expect.objectContaining({ queued: true }),
      sevensaSync: expect.objectContaining({ queued: true })
    });
    expect(rentGuyService.syncLead).toHaveBeenCalled();
    expect(sevensaService.submitLead).toHaveBeenCalled();
  });

  it('throws when hCaptcha token is missing while verification is ingeschakeld', async () => {
    config.integrations.hcaptcha = {
      enabled: true,
      siteKey: 'site',
      secretKey: 'secret',
      verifyUrl: 'https://hcaptcha.com/siteverify'
    };

    await expect(
      contactService.saveContact(
        {
          name: 'Zonder captcha',
          email: 'nocaptcha@example.com',
          phone: '0612345678',
          message: 'Hallo',
          eventType: 'Bruiloft'
        },
        { captchaToken: '', remoteIp: '127.0.0.1' }
      )
    ).rejects.toMatchObject({
      status: 400,
      publicMessage: 'Captcha validatie is vereist.'
    });
  });

  it('verifies the hCaptcha token when configured', async () => {
    config.integrations.hcaptcha = {
      enabled: true,
      siteKey: 'site',
      secretKey: 'secret',
      verifyUrl: 'https://hcaptcha.com/siteverify'
    };

    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    });

    rentGuyService.syncLead.mockResolvedValueOnce({ delivered: true, queued: false, queueSize: 0 });
    sevensaService.submitLead.mockResolvedValueOnce({ delivered: true, queued: false, queueSize: 0 });

    const result = await contactService.saveContact(
      {
        name: 'Captcha',
        email: 'captcha@example.com',
        phone: '0612345678',
        message: 'Hallo',
        eventType: 'Bruiloft'
      },
      { captchaToken: 'valid-token', remoteIp: '127.0.0.1' }
    );

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, options] = fetchSpy.mock.calls[0];
    expect(url).toBe('https://hcaptcha.com/siteverify');
    expect(options.method).toBe('POST');
    expect(options.body).toBeInstanceOf(URLSearchParams);
    expect(options.body.get('secret')).toBe('secret');
    expect(options.body.get('response')).toBe('valid-token');
    expect(options.body.get('remoteip')).toBe('127.0.0.1');
    expect(result).toHaveProperty('id');

    fetchSpy.mockRestore();
  });

  it('exposes the current status information', () => {
    db.getStatus.mockReturnValueOnce({ connected: false, lastError: 'boom' });

    expect(contactService.getContactServiceStatus()).toEqual({
      databaseConnected: false,
      storageStrategy: 'in-memory',
      fallbackQueueSize: 0,
      lastError: 'boom'
    });
  });
});

describe('callbackRequestService', () => {
  afterEach(() => {
    jest.clearAllMocks();
    callbackRequestService.resetInMemoryStore();
  });

  it('persists callback requests when the database is available', async () => {
    const createdAt = new Date('2024-03-01T12:00:00Z');
    db.isConfigured.mockReturnValueOnce(true);
    db.runQuery.mockResolvedValueOnce({
      rows: [
        {
          id: 'callback-id',
          status: 'new',
          eventType: 'bruiloft',
          createdAt
        }
      ]
    });
    rentGuyService.syncLead.mockResolvedValueOnce({ delivered: true, queued: false, queueSize: 0 });
    sevensaService.submitLead.mockResolvedValueOnce({ delivered: true, queued: false, queueSize: 0 });

    const result = await callbackRequestService.saveCallbackRequest({
      name: 'Bel mij terug',
      phone: '0612345678',
      eventType: 'bruiloft'
    });

    expect(result).toMatchObject({
      id: 'callback-id',
      status: 'new',
      persisted: true,
      eventType: 'bruiloft',
      rentGuySync: { delivered: true, queued: false },
      sevensaSync: { delivered: true, queued: false }
    });
    expect(db.runQuery).toHaveBeenCalled();
    expect(rentGuyService.syncLead).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'callback-id',
        name: 'Bel mij terug',
        phone: '0612345678'
      }),
      { source: 'quick-callback-form' }
    );
    expect(sevensaService.submitLead).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'callback-id',
        phone: '0612345678',
        eventType: 'bruiloft'
      }),
      { source: 'quick-callback-form' }
    );
  });

  it('uses in-memory storage when the database insert fails', async () => {
    db.isConfigured.mockReturnValueOnce(true);
    db.runQuery.mockRejectedValueOnce(new Error('boom'));
    const errorSpy = mockConsole('error');

    const result = await callbackRequestService.saveCallbackRequest({
      name: 'Fallback',
      phone: '0612345678',
      eventType: 'bedrijfsfeest'
    });

    expect(errorSpy).toHaveBeenCalled();
    expect(result).toMatchObject({
      status: 'pending',
      persisted: false,
      eventType: 'bedrijfsfeest',
      rentGuySync: expect.objectContaining({ queued: true }),
      sevensaSync: expect.objectContaining({ queued: true })
    });
  });

  it('reports the current storage strategy', () => {
    db.getStatus.mockReturnValueOnce({ connected: false, lastError: 'kapot' });

    expect(callbackRequestService.getCallbackRequestServiceStatus()).toEqual({
      databaseConnected: false,
      storageStrategy: 'in-memory',
      fallbackQueueSize: 0,
      lastError: 'kapot'
    });
  });
});

describe('bookingService', () => {
  afterEach(() => {
    jest.clearAllMocks();
    bookingService.resetInMemoryStore();
    packageService.resetCache();
  });

  it('creates bookings via the database when available', async () => {
    const createdAt = new Date('2024-02-02T20:00:00Z');
    db.isConfigured.mockReturnValueOnce(true);
    db.runQuery.mockResolvedValueOnce({
      rows: [
        {
          id: 'booking-id',
          status: 'pending',
          created_at: createdAt
        }
      ]
    });
    rentGuyService.syncBooking.mockResolvedValueOnce({ delivered: true, queued: false, queueSize: 0 });

    const result = await bookingService.createBooking({
      name: 'Booker',
      email: 'booker@example.com',
      phone: '0612345678',
      eventType: 'Jubileum',
      eventDate: '2024-09-01',
      message: 'Graag meer info',
      packageId: 'silver'
    });

    expect(result).toMatchObject({
      id: 'booking-id',
      status: 'pending',
      createdAt,
      persisted: true,
      eventDate: expect.any(Date),
      eventEndDate: null,
      eventTimeZone: 'Europe/Amsterdam',
      rentGuySync: { delivered: true, queued: false, queueSize: 0 }
    });
    expect(rentGuyService.syncBooking).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'booking-id',
        name: 'Booker',
        email: 'booker@example.com'
      }),
      { source: 'booking-flow' }
    );
  });

  it('normalizes same-day event times using the provided timezone', async () => {
    const createdAt = new Date('2024-05-01T12:00:00Z');
    db.isConfigured.mockReturnValueOnce(true);
    db.runQuery.mockResolvedValueOnce({
      rows: [
        {
          id: 'same-day',
          status: 'pending',
          created_at: createdAt
        }
      ]
    });
    rentGuyService.syncBooking.mockResolvedValueOnce({ delivered: true, queued: false, queueSize: 0 });

    await bookingService.createBooking({
      name: 'Timezone Tester',
      email: 'tz@example.com',
      phone: '0612345678',
      eventType: 'Test',
      eventDate: {
        start: '2024-07-10T18:00',
        end: '2024-07-10T23:00',
        timezone: 'Europe/Amsterdam'
      }
    });

    const params = db.runQuery.mock.calls[0][1];
    expect(params[4]).toBeInstanceOf(Date);
    expect(params[4].toISOString()).toBe('2024-07-10T16:00:00.000Z');

    const syncPayload = rentGuyService.syncBooking.mock.calls[0][0];
    expect(syncPayload.eventDate.toISOString()).toBe('2024-07-10T16:00:00.000Z');
    expect(syncPayload.eventEndDate.toISOString()).toBe('2024-07-10T21:00:00.000Z');
    expect(syncPayload.eventTimeZone).toBe('Europe/Amsterdam');
  });

  it('normalizes overnight events that span into the next day', async () => {
    const createdAt = new Date('2024-05-02T12:00:00Z');
    db.isConfigured.mockReturnValueOnce(true);
    db.runQuery.mockResolvedValueOnce({
      rows: [
        {
          id: 'overnight',
          status: 'pending',
          created_at: createdAt
        }
      ]
    });
    rentGuyService.syncBooking.mockResolvedValueOnce({ delivered: true, queued: false, queueSize: 0 });

    await bookingService.createBooking({
      name: 'Overnight Event',
      email: 'overnight@example.com',
      phone: '0612345678',
      eventType: 'Nightlife',
      eventDate: {
        start: '2024-08-15T20:00',
        end: '2024-08-16T02:00',
        timezone: 'Europe/Amsterdam'
      }
    });

    const params = db.runQuery.mock.calls[0][1];
    expect(params[4]).toBeInstanceOf(Date);
    expect(params[4].toISOString()).toBe('2024-08-15T18:00:00.000Z');

    const syncPayload = rentGuyService.syncBooking.mock.calls[0][0];
    expect(syncPayload.eventDate.toISOString()).toBe('2024-08-15T18:00:00.000Z');
    expect(syncPayload.eventEndDate.toISOString()).toBe('2024-08-16T00:00:00.000Z');
  });

  it('returns in-memory bookings when the database is unavailable', async () => {
    db.isConfigured.mockReturnValue(false);

    const created = await bookingService.createBooking({
      name: 'Local Booker',
      email: 'local@example.com',
      phone: '0612345678',
      eventType: 'Event',
      eventDate: '2024-09-10',
      message: 'Test'
    });

    expect(created.persisted).toBe(false);
    expect(created.rentGuySync).toEqual(expect.objectContaining({ queued: true }));
    expect(created.mailDelivery).toEqual(
      expect.objectContaining({ skipped: true, reason: 'mail-not-configured' })
    );

    const result = await bookingService.getRecentBookings(5);
    expect(result.persisted).toBe(false);
    expect(result.bookings[0]).toMatchObject({ name: 'Local Booker' });
  });

  it('exposes database backed bookings', async () => {
    db.isConfigured.mockReturnValueOnce(true);
    db.runQuery.mockResolvedValueOnce({
      rows: [
        {
          id: 'db-booking',
          name: 'DB Booker',
          eventType: 'Bruiloft'
        }
      ]
    });

    const result = await bookingService.getRecentBookings();
    expect(result).toEqual({
      persisted: true,
      bookings: [
        {
          id: 'db-booking',
          name: 'DB Booker',
          eventType: 'Bruiloft'
        }
      ]
    });
  });

  it('logs errors when database reads fail', async () => {
    db.isConfigured.mockReturnValue(true);
    db.runQuery.mockRejectedValueOnce(new Error('select failed'));
    const errorSpy = mockConsole('error');

    const result = await bookingService.getRecentBookings();
    expect(errorSpy).toHaveBeenCalled();
    expect(result.persisted).toBe(false);
  });

  it('reports service status details', () => {
    db.getStatus.mockReturnValueOnce({ connected: true, lastError: null });

    expect(bookingService.getBookingServiceStatus()).toEqual({
      databaseConnected: true,
      storageStrategy: 'postgres',
      fallbackQueueSize: 0,
      lastError: null
    });
  });
});

describe('catalog services', () => {
  afterEach(async () => {
    jest.clearAllMocks();
    await Promise.all([packageService.resetCache(), reviewService.resetCache()]);
  });

  it('returns database backed packages when available', async () => {
    db.isConfigured.mockReturnValueOnce(true);
    db.runQuery.mockResolvedValueOnce({
      rows: [
        {
          id: 'db-package',
          name: 'Database Pakket',
          price: '999',
          duration: '4 uur',
          description: 'Test',
          features: ['DJ'],
          popular: true
        }
      ]
    });

    const result = await packageService.getPackages();
    expect(result).toEqual({
      packages: [
        {
          id: 'db-package',
          name: 'Database Pakket',
          price: 999,
          duration: '4 uur',
          description: 'Test',
          features: ['DJ'],
          popular: true
        }
      ],
      source: 'database',
      cacheStatus: 'refreshed'
    });
  });

  it('falls back to static packages when the database errors', async () => {
    db.isConfigured.mockReturnValueOnce(true);
    db.runQuery.mockRejectedValueOnce(new Error('select failed'));
    const errorSpy = mockConsole('error');

    const result = await packageService.getPackages();
    expect(errorSpy).toHaveBeenCalled();
    expect(result.source === 'content' || result.source === 'static').toBe(true);
    expect(result.cacheStatus).toBe('refreshed');
    expect(result.packages.length).toBeGreaterThan(0);
  });

  it('serves cached packages on subsequent calls', async () => {
    db.isConfigured.mockReturnValue(true);
    db.runQuery.mockResolvedValueOnce({
      rows: [
        {
          id: 'cached-package',
          name: 'Cached',
          price: '1000',
          duration: '4 uur',
          description: 'Cached desc',
          features: ['DJ'],
          popular: false
        }
      ]
    });

    const fresh = await packageService.getPackages();
    expect(fresh.cacheStatus).toBe('refreshed');
    expect(db.runQuery).toHaveBeenCalledTimes(1);

    db.runQuery.mockClear();
    const cached = await packageService.getPackages();
    expect(cached.cacheStatus).toBe('hit');
    expect(db.runQuery).not.toHaveBeenCalled();
  });

  it('returns database backed reviews when available', async () => {
    db.isConfigured.mockReturnValueOnce(true);
    db.runQuery.mockResolvedValueOnce({
      rows: [
        {
          id: 'review-1',
          name: 'Reviewer',
          eventType: 'Event',
          rating: 5,
          reviewText: 'Great!',
          createdAt: new Date('2024-04-01T10:00:00Z'),
          approved: true
        }
      ]
    });

    const result = await reviewService.getApprovedReviews(1);
    expect(result).toEqual({
      reviews: [
        {
          id: 'review-1',
          name: 'Reviewer',
          eventType: 'Event',
          rating: 5,
          reviewText: 'Great!',
          createdAt: new Date('2024-04-01T10:00:00Z'),
          moderationState: 'approved'
        }
      ],
      source: 'database',
      cacheStatus: 'refreshed'
    });
  });

  it('falls back to static reviews when the database errors', async () => {
    db.isConfigured.mockReturnValueOnce(true);
    db.runQuery.mockRejectedValueOnce(new Error('select failed'));
    const errorSpy = mockConsole('error');

    const result = await reviewService.getApprovedReviews();
    expect(errorSpy).toHaveBeenCalled();
    expect(result.source).toBe('static');
    expect(result.cacheStatus).toBe('refreshed');
    expect(result.reviews.length).toBeGreaterThan(0);
  });

  it('serves cached reviews on subsequent calls', async () => {
    db.isConfigured.mockReturnValue(true);
    db.runQuery.mockResolvedValueOnce({
      rows: [
        {
          id: 'review-1',
          name: 'Reviewer',
          eventType: 'Event',
          rating: 5,
          reviewText: 'Great!',
          createdAt: new Date('2024-04-01T10:00:00Z'),
          approved: true
        }
      ]
    });

    const fresh = await reviewService.getApprovedReviews(1);
    expect(fresh.cacheStatus).toBe('refreshed');
    expect(db.runQuery).toHaveBeenCalledTimes(1);

    db.runQuery.mockClear();
    const cached = await reviewService.getApprovedReviews(1);
    expect(cached.cacheStatus).toBe('hit');
    expect(db.runQuery).not.toHaveBeenCalled();
  });

  it('returns an empty pending list when the database is not configured', async () => {
    db.isConfigured.mockReturnValue(false);
    const pending = await reviewService.getPendingReviews();
    expect(pending).toEqual([]);
  });

  it('loads pending testimonials from the database', async () => {
    const createdAt = new Date('2024-05-10T12:00:00Z');
    db.runQuery.mockClear();
    db.isConfigured.mockReturnValueOnce(true);
    db.runQuery.mockResolvedValueOnce({
      rows: [
        {
          id: 42,
          name: 'Pending Person',
          eventType: 'Bruiloft',
          city: 'Eindhoven',
          rating: 4,
          reviewText: 'Fantastisch feest!',
          createdAt,
          approved: false
        }
      ]
    });

    const pending = await reviewService.getPendingReviews();
    expect(pending).toEqual([
      {
        id: 42,
        name: 'Pending Person',
        eventType: 'Bruiloft',
        city: 'Eindhoven',
        rating: 4,
        reviewText: 'Fantastisch feest!',
        createdAt,
        moderationState: 'pending'
      }
    ]);
  });

  it('approves a testimonial and clears the cache', async () => {
    const createdAt = new Date('2024-05-01T08:30:00Z');
    db.runQuery.mockClear();
    db.isConfigured.mockReturnValueOnce(true);
    db.runQuery.mockResolvedValueOnce({
      rowCount: 1,
      rows: [
        {
          id: 7,
          name: 'Pending Person',
          eventType: 'Corporate',
          city: 'Tilburg',
          rating: 5,
          reviewText: 'Geweldig team!',
          createdAt,
          approved: true
        }
      ]
    });

    const cacheDelSpy = jest.spyOn(cache, 'del').mockResolvedValue();

    const result = await reviewService.approveReview(7);
    expect(db.runQuery).toHaveBeenCalledWith(expect.stringContaining('UPDATE reviews'), [7]);
    expect(cacheDelSpy).toHaveBeenCalledWith('reviews-service');
    expect(result).toEqual({
      id: 7,
      name: 'Pending Person',
      eventType: 'Corporate',
      city: 'Tilburg',
      rating: 5,
      reviewText: 'Geweldig team!',
      createdAt,
      moderationState: 'approved'
    });

    cacheDelSpy.mockRestore();
  });

  it('rejects a testimonial and clears the cache', async () => {
    const createdAt = new Date('2024-05-02T09:15:00Z');
    db.runQuery.mockClear();
    db.isConfigured.mockReturnValueOnce(true);
    db.runQuery.mockResolvedValueOnce({
      rowCount: 1,
      rows: [
        {
          id: 8,
          name: 'Weiger Test',
          eventType: 'Jubileum',
          city: 'Breda',
          rating: 3,
          reviewText: 'Niet helemaal tevreden.',
          createdAt
        }
      ]
    });

    const cacheDelSpy = jest.spyOn(cache, 'del').mockResolvedValue();

    const result = await reviewService.rejectReview(8);
    expect(db.runQuery).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM reviews'), [8]);
    expect(cacheDelSpy).toHaveBeenCalledWith('reviews-service');
    expect(result).toEqual({
      id: 8,
      name: 'Weiger Test',
      eventType: 'Jubileum',
      city: 'Breda',
      rating: 3,
      reviewText: 'Niet helemaal tevreden.',
      createdAt,
      moderationState: 'rejected'
    });

    cacheDelSpy.mockRestore();
  });
});
afterAll(() => {
  process.env = ORIGINAL_ENV;
});
