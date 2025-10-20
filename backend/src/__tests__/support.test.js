const http = require('http');
const express = require('express');

jest.mock('../services/supportConfigService', () => ({
  getSupportConfiguration: jest.fn()
}));

const supportRouter = require('../routes/support');
const { getSupportConfiguration } = require('../services/supportConfigService');

describe('GET /support', () => {
  let server;
  let baseUrl;

  beforeAll((done) => {
    const app = express();
    app.use('/support', supportRouter);
    app.use((error, _req, res, _next) => {
      res.status(error.status || 500).json({ error: error.message });
    });

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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  async function request(path) {
    const url = new URL(path, baseUrl);
    const response = await fetch(url);
    const text = await response.text();
    const body = text ? JSON.parse(text) : undefined;
    return { status: response.status, body };
  }

  it('returns support configuration from the service', async () => {
    const payload = {
      channels: [
        { id: 'email', type: 'email', label: 'Email', value: 'support@example.com' }
      ],
      availability: {
        timezone: 'Europe/Amsterdam',
        windows: [
          { days: ['monday'], start: '09:00', end: '17:00' }
        ]
      },
      message: { headline: 'Need help?', body: 'Contact us.' },
      locale: 'en',
      locales: ['en'],
      metadata: { updatedAt: null, source: 'fallback', cacheStatus: 'hit', stale: false, error: null }
    };

    getSupportConfiguration.mockResolvedValue(payload);

    const response = await request('/support');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(payload);
    expect(getSupportConfiguration).toHaveBeenCalledWith(undefined);
  });

  it('passes the locale query to the configuration service', async () => {
    const payload = {
      channels: [],
      availability: { timezone: 'UTC', windows: [] },
      message: { headline: 'Hello', body: 'World' },
      locale: 'nl',
      locales: ['nl'],
      metadata: { updatedAt: null, source: 'api', cacheStatus: 'miss', stale: false, error: null }
    };

    getSupportConfiguration.mockResolvedValue(payload);

    const response = await request('/support?locale=nl-NL');

    expect(response.status).toBe(200);
    expect(response.body.locale).toBe('nl');
    expect(getSupportConfiguration).toHaveBeenCalledWith('nl-NL');
  });

  it('returns an error when the service rejects', async () => {
    getSupportConfiguration.mockRejectedValue(new Error('Service unavailable'));

    const response = await request('/support');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Service unavailable' });
  });
});
