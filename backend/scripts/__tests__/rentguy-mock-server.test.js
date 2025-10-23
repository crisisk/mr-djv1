const request = require('supertest');
const { createRentGuyMockServer } = require('../rentguy-mock-server');

const baseConfig = {
  apiKey: 'secret',
  workspaceId: 'workspace-1',
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  }
};

describe('rentguy-mock-server', () => {
  function buildServer(overrides = {}) {
    return createRentGuyMockServer({ ...baseConfig, ...overrides });
  }

  it('rejects requests without authentication', async () => {
    const { app } = buildServer();

    const response = await request(app).post('/bookings').send({ id: 'booking-1' });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('missing-auth');
  });

  it('stores bookings when authentication passes', async () => {
    const { app, state } = buildServer();

    await request(app)
      .post('/bookings')
      .set('Authorization', 'Bearer secret')
      .set('X-RentGuy-Workspace', 'workspace-1')
      .send({ id: 'booking-1', status: 'pending' })
      .expect(201);

    expect(state.bookings).toHaveLength(1);
    expect(state.lastDelivery).toMatchObject({ resource: 'booking', status: 201 });
  });

  it('supports failure simulation via headers', async () => {
    const { app, state } = buildServer();

    const response = await request(app)
      .post('/bookings')
      .set('Authorization', 'Bearer secret')
      .set('X-RentGuy-Workspace', 'workspace-1')
      .set('X-RentGuy-Simulate', 'rate-limit')
      .send({ id: 'booking-2' });

    expect(response.status).toBe(429);
    expect(state.lastError).toMatchObject({ status: 429, message: 'Rate limit simulated' });
  });

  it('exposes delivery counters', async () => {
    const { app } = buildServer();

    await request(app)
      .post('/leads')
      .set('Authorization', 'Bearer secret')
      .set('X-RentGuy-Workspace', 'workspace-1')
      .send({ id: 'lead-1' });

    const status = await request(app)
      .get('/status')
      .set('Authorization', 'Bearer secret')
      .set('X-RentGuy-Workspace', 'workspace-1');

    expect(status.status).toBe(200);
    expect(status.body.deliveries.leads).toBe(1);
  });
});
