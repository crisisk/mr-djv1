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

async function loadService(env = {}) {
  jest.resetModules();
  process.env = buildEnv(env);
  const service = require('../services/sevensaService');
  await service.reset();
  return service;
}

describe('sevensaService', () => {
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    if (ORIGINAL_FETCH) {
      global.fetch = ORIGINAL_FETCH;
    } else {
      delete global.fetch;
    }
  });

  it('fails fast when Sevensa webhook is missing', async () => {
    await expect(loadService({ SEVENSA_SUBMIT_URL: undefined })).rejects.toThrow(
      'Missing required environment variable "SEVENSA_SUBMIT_URL" for Sevensa lead automation (SEVENSA_SUBMIT_URL).'
    );
  });

  it('delivers submissions when configured', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 204,
      text: () => Promise.resolve('')
    });
    global.fetch = fetchMock;

    const sevensaService = await loadService({ SEVENSA_SUBMIT_URL: 'https://api.hsforms.com/submit' });

    const result = await sevensaService.submitLead({
      id: 'lead-2',
      email: 'ok@example.com',
      firstName: 'Ok'
    });

    expect(result).toEqual({ delivered: true, queued: false, queueSize: 0 });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.hsforms.com/submit',
      expect.objectContaining({ method: 'POST' })
    );
    await expect(sevensaService.getStatus()).resolves.toMatchObject({ configured: true, queueSize: 0 });
  });

  it('moves failed attempts to the dead letter queue after max attempts', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: () => Promise.resolve('error')
    });
    global.fetch = fetchMock;

    const sevensaService = await loadService({
      SEVENSA_SUBMIT_URL: 'https://api.hsforms.com/submit',
      SEVENSA_QUEUE_MAX_ATTEMPTS: '2'
    });

    const result = await sevensaService.submitLead({
      id: 'lead-3',
      email: 'fail@example.com',
      firstName: 'Fail'
    });

    expect(result).toMatchObject({ queued: true, reason: 'delivery-failed' });

    await sevensaService.flushQueue(5);
    await sevensaService.flushQueue(5);

    const status = await sevensaService.getStatus();
    expect(status.deadLetterCount).toBeGreaterThanOrEqual(1);
    expect(status.queueSize).toBe(0);
  });
});
