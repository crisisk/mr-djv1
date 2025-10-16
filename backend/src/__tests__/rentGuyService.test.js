const ORIGINAL_ENV = { ...process.env };
const ORIGINAL_FETCH = global.fetch;

function loadService() {
  jest.resetModules();
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

  it('queues leads when the integration is not configured', async () => {
    delete process.env.RENTGUY_API_BASE_URL;
    delete process.env.RENTGUY_API_KEY;
    const rentGuyService = loadService();
    rentGuyService.reset();

    const result = await rentGuyService.syncLead({
      id: 'lead-1',
      status: 'new',
      eventType: 'Bruiloft',
      eventDate: '2024-10-01',
      packageId: 'gold',
      name: 'Alice',
      email: 'alice@example.com',
      phone: '0612345678',
      message: 'Hoi',
      persisted: false
    });

    expect(result).toMatchObject({ delivered: false, queued: true, reason: 'not-configured' });
    expect(rentGuyService.getStatus()).toMatchObject({ configured: false, queueSize: 1 });
  });

  it('sends bookings to RentGuy when configured', async () => {
    process.env.RENTGUY_API_BASE_URL = 'https://rentguy.test/api';
    process.env.RENTGUY_API_KEY = 'secret';
    process.env.RENTGUY_WORKSPACE_ID = 'workspace-1';

    const fetchMock = jest
      .fn()
      .mockResolvedValue({ ok: true, status: 201, text: () => Promise.resolve('') });
    global.fetch = fetchMock;

    const rentGuyService = loadService();
    rentGuyService.reset();

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

    expect(rentGuyService.getStatus()).toMatchObject({
      configured: true,
      queueSize: 0,
      lastSyncSuccess: expect.objectContaining({ resource: 'bookings' })
    });
  });

  it('retries queued events via flushQueue', async () => {
    process.env.RENTGUY_API_BASE_URL = 'https://rentguy.test/api';
    process.env.RENTGUY_API_KEY = 'secret';

    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 500, text: () => Promise.resolve('oops') })
      .mockResolvedValueOnce({ ok: true, status: 200, text: () => Promise.resolve('') });
    global.fetch = fetchMock;

    const rentGuyService = loadService();
    rentGuyService.reset();

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
    expect(rentGuyService.getStatus()).toMatchObject({ queueSize: 1, lastSyncError: expect.any(Object) });

    const flushResult = await rentGuyService.flushQueue();
    expect(flushResult).toEqual({ attempted: 1, delivered: 1, remaining: 0 });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(rentGuyService.getStatus()).toMatchObject({ queueSize: 0, lastSyncSuccess: expect.any(Object) });
  });
});
