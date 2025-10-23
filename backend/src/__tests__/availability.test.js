const { buildRequiredEnv } = require('../testUtils/env');

const ORIGINAL_ENV = { ...process.env };
process.env = { ...ORIGINAL_ENV, ...buildRequiredEnv() };

const express = require('express');
const request = require('supertest');
const availabilityService = require('../services/availabilityService');
const availabilityRouter = require('../routes/availability');

jest.mock('../services/availabilityService');
jest.mock('../lib/logger', () => {
  const noop = jest.fn();
  const child = jest.fn(() => ({ info: noop, warn: noop, error: noop }));
  return {
    logger: {
      info: noop,
      warn: noop,
      error: noop,
      child,
    },
  };
});
jest.mock('../middleware/rateLimiter', () => (_req, _res, next) => next());

const app = express();
app.use(express.json());
app.use('/availability', availabilityRouter);

describe('POST /availability/check', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('validates the payload', async () => {
    const response = await request(app).post('/availability/check').send({});

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({
      error: 'Validatie mislukt'
    });
  });

  it('returns 200 when Sevensa delivers immediately', async () => {
    availabilityService.submitAvailabilityRequest.mockResolvedValue({
      sevensaResult: {
        delivered: true,
        queued: false,
        queueSize: 0
      }
    });

    const payload = {
      email: 'test@example.com',
      eventDate: new Date().toISOString(),
      marketingConsent: true,
      statisticsConsent: true
    };

    const response = await request(app).post('/availability/check').send(payload);

    expect(availabilityService.submitAvailabilityRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        email: payload.email
      })
    );
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      queued: false
    });
  });

  it('returns 202 when the request is queued', async () => {
    availabilityService.submitAvailabilityRequest.mockResolvedValue({
      sevensaResult: {
        delivered: false,
        queued: true,
        queueSize: 2,
        reason: 'not-configured'
      }
    });

    const response = await request(app)
      .post('/availability/check')
      .send({
        email: 'queue@example.com',
        eventDate: new Date().toISOString()
      });

    expect(response.status).toBe(202);
    expect(response.body).toMatchObject({
      success: false,
      queued: true
    });
  });
});
