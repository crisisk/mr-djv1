const ORIGINAL_ENV = { ...process.env };
const ORIGINAL_FETCH = global.fetch;

function loadService(env = {}) {
  jest.resetModules();
  process.env = { ...ORIGINAL_ENV, ...env };
  const service = require('../services/hubspotService');
  service.reset();
  return service;
}

describe('hubspotService', () => {
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    if (ORIGINAL_FETCH) {
      global.fetch = ORIGINAL_FETCH;
    } else {
      delete global.fetch;
    }
  });

  it('queues submissions when no submit URL is configured', async () => {
    const hubspotService = loadService({ HUBSPOT_SUBMIT_URL: '' });

    const result = await hubspotService.submitLead({
      id: 'lead-1',
      email: 'lead@example.com',
      firstName: 'Lead'
    });

    expect(result).toMatchObject({ queued: true, reason: 'not-configured' });
    expect(hubspotService.getStatus()).toMatchObject({ configured: false, queueSize: 1 });
  });

  it('delivers submissions when configured', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 204,
      text: () => Promise.resolve('')
    });
    global.fetch = fetchMock;

    const hubspotService = loadService({ HUBSPOT_SUBMIT_URL: 'https://api.hsforms.com/submit' });

    const result = await hubspotService.submitLead({
      id: 'lead-2',
      email: 'ok@example.com',
      firstName: 'Ok'
    });

    expect(result).toEqual({ delivered: true, queued: false, queueSize: 0 });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.hsforms.com/submit',
      expect.objectContaining({ method: 'POST' })
    );
    expect(hubspotService.getStatus()).toMatchObject({ configured: true, queueSize: 0 });
  });

  it('moves failed attempts to the dead letter queue after max attempts', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: () => Promise.resolve('error')
    });
    global.fetch = fetchMock;

    const hubspotService = loadService({
      HUBSPOT_SUBMIT_URL: 'https://api.hsforms.com/submit',
      HUBSPOT_QUEUE_MAX_ATTEMPTS: '2'
    });

    const result = await hubspotService.submitLead({
      id: 'lead-3',
      email: 'fail@example.com',
      firstName: 'Fail'
    });

    expect(result).toMatchObject({ queued: true, reason: 'delivery-failed' });

    await hubspotService.processQueue({ force: true });
    await hubspotService.processQueue({ force: true });

    const status = hubspotService.getStatus();
    expect(status.deadLetterCount).toBe(1);
    expect(status.queueSize).toBe(0);
  });
});
