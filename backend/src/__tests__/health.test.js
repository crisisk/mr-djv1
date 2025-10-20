jest.mock('../lib/db', () => ({
  getStatus: jest.fn(() => ({
    configured: true,
    connected: true,
    lastError: null,
    lastSuccessfulAt: '2024-01-01T00:00:00.000Z',
    lastFailureAt: null
  }))
}));

jest.mock('../services/contactService', () => ({
  ping: jest.fn(() => ({
    ok: true,
    storageStrategy: 'postgres',
    fallbackQueueSize: 0
  }))
}));

jest.mock('../services/callbackRequestService', () => ({
  ping: jest.fn(() => ({
    ok: true,
    storageStrategy: 'postgres',
    fallbackQueueSize: 0
  }))
}));

jest.mock('../services/bookingService', () => ({
  ping: jest.fn(() => ({
    ok: true,
    storageStrategy: 'postgres',
    fallbackQueueSize: 0
  }))
}));

jest.mock('../services/rentGuyService', () => ({
  ping: jest.fn(() => Promise.resolve({
    ok: true,
    configured: true,
    queueSize: 0,
    retryAgeP95: 0
  }))
}));

jest.mock('../services/redisService', () => ({
  ping: jest.fn(() => Promise.resolve({
    ok: true,
    connected: true,
    response: 'PONG',
    durationMs: 2
  }))
}));

const http = require('http');
const express = require('express');
const db = require('../lib/db');
const contactService = require('../services/contactService');
const callbackRequestService = require('../services/callbackRequestService');
const bookingService = require('../services/bookingService');
const rentGuyService = require('../services/rentGuyService');
const redisService = require('../services/redisService');
const healthRouter = require('../routes/health');

describe('GET /health', () => {
  let server;
  let baseUrl;

  beforeAll((done) => {
    const app = express();
    app.use('/health', healthRouter);
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

    db.getStatus.mockReturnValue({
      configured: true,
      connected: true,
      lastError: null,
      lastSuccessfulAt: '2024-01-01T00:00:00.000Z',
      lastFailureAt: null
    });

    contactService.ping.mockReturnValue({
      ok: true,
      storageStrategy: 'postgres',
      fallbackQueueSize: 2
    });

    callbackRequestService.ping.mockReturnValue({
      ok: true,
      storageStrategy: 'postgres',
      fallbackQueueSize: 1
    });

    bookingService.ping.mockReturnValue({
      ok: true,
      storageStrategy: 'postgres',
      fallbackQueueSize: 0
    });

    rentGuyService.ping.mockResolvedValue({
      ok: true,
      configured: true,
      queueSize: 5,
      retryAgeP95: 1500
    });

    redisService.ping.mockResolvedValue({
      ok: true,
      connected: true,
      response: 'PONG',
      durationMs: 3
    });
  });

  async function request(path) {
    const url = new URL(path, baseUrl);
    const response = await fetch(url);
    const text = await response.text();
    const body = text ? JSON.parse(text) : undefined;
    return { status: response.status, body };
  }

  it('reports aggregated dependency health statuses', async () => {
    const response = await request('/health');

    expect(response.status).toBe(200);
    expect(contactService.ping).toHaveBeenCalledTimes(1);
    expect(callbackRequestService.ping).toHaveBeenCalledTimes(1);
    expect(bookingService.ping).toHaveBeenCalledTimes(1);
    expect(rentGuyService.ping).toHaveBeenCalledTimes(1);
    expect(redisService.ping).toHaveBeenCalledTimes(1);

    expect(response.body).toMatchObject({
      status: 'ok',
      dependencies: {
        database: {
          configured: true,
          connected: true,
          lastError: null,
          lastSuccessfulAt: '2024-01-01T00:00:00.000Z',
          lastFailureAt: null
        },
        storage: {
          contact: {
            ok: true,
            strategy: 'postgres',
            fallbackQueueSize: 2
          },
          callbackRequests: {
            ok: true,
            strategy: 'postgres',
            fallbackQueueSize: 1
          },
          bookings: {
            ok: true,
            strategy: 'postgres',
            fallbackQueueSize: 0
          }
        },
        cache: {
          redis: {
            ok: true,
            connected: true,
            response: 'PONG',
            durationMs: 3
          }
        },
        integrations: {
          rentGuy: {
            ok: true,
            configured: true,
            queueSize: 5,
            retryAgeP95: 1500
          },
          personalization: expect.any(Object)
        }
      }
    });
  });

  it('surfaces dependency degradation information', async () => {
    redisService.ping.mockResolvedValueOnce({
      ok: false,
      connected: false,
      error: 'timeout'
    });
    rentGuyService.ping.mockResolvedValueOnce({
      ok: false,
      configured: false,
      error: 'missing-config'
    });

    const response = await request('/health');

    expect(response.status).toBe(200);
    expect(response.body.dependencies.cache.redis).toEqual(
      expect.objectContaining({
        ok: false,
        error: 'timeout'
      })
    );
    expect(response.body.dependencies.integrations.rentGuy).toEqual(
      expect.objectContaining({
        ok: false,
        error: 'missing-config'
      })
    );
  });
});
