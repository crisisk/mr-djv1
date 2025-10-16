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

const db = require('../lib/db');
const contactService = require('../services/contactService');
const bookingService = require('../services/bookingService');
const packageService = require('../services/packageService');
const reviewService = require('../services/reviewService');

function mockConsole(method = 'error') {
  return jest.spyOn(console, method).mockImplementation(() => {});
}

describe('contactService', () => {
  afterEach(() => {
    jest.clearAllMocks();
    contactService.resetInMemoryStore();
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
      packageId: 'gold'
    });
    expect(db.runQuery).toHaveBeenCalled();
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
      eventDate: null
    });
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

describe('bookingService', () => {
  afterEach(() => {
    jest.clearAllMocks();
    bookingService.resetInMemoryStore();
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

    const result = await bookingService.createBooking({
      name: 'Booker',
      email: 'booker@example.com',
      phone: '0612345678',
      eventType: 'Jubileum',
      eventDate: '2024-09-01',
      message: 'Graag meer info',
      packageId: 'silver'
    });

    expect(result).toEqual({
      id: 'booking-id',
      status: 'pending',
      createdAt,
      persisted: true
    });
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
  afterEach(() => {
    jest.clearAllMocks();
    packageService.resetCache();
    reviewService.resetCache();
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
    expect(result.source).toBe('static');
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
          createdAt: new Date('2024-04-01T10:00:00Z')
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
          createdAt: new Date('2024-04-01T10:00:00Z')
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
          createdAt: new Date('2024-04-01T10:00:00Z')
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
});
