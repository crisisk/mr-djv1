jest.mock('../lib/db', () => ({
  isConfigured: jest.fn(() => false),
  runQuery: jest.fn()
}));

jest.mock('../services/rentGuyService', () => ({
  syncPersonalizationEvent: jest.fn(() =>
    Promise.resolve({ delivered: true, queued: false, queueSize: 0 })
  )
}));

const db = require('../lib/db');
const rentGuyService = require('../services/rentGuyService');
const config = require('../config');

const {
  getVariantForRequest,
  resetLogs,
  resetCache,
  getExposureLog,
  getAutomationRetryState,
  flushAutomationQueue,
  resetAutomationQueue
} = require('../services/personalizationService');

const ORIGINAL_WEBHOOK = config.personalization.automationWebhook;
const ORIGINAL_FETCH = global.fetch;

describe('personalizationService', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    resetLogs();
    resetCache();
    await resetAutomationQueue();
    db.isConfigured.mockReturnValue(false);
    rentGuyService.syncPersonalizationEvent.mockResolvedValue({
      delivered: true,
      queued: false,
      queueSize: 0
    });
  });

  afterEach(async () => {
    config.personalization.automationWebhook = ORIGINAL_WEBHOOK;
    if (ORIGINAL_FETCH) {
      global.fetch = ORIGINAL_FETCH;
    } else {
      delete global.fetch;
    }
    await resetAutomationQueue();
  });

  it('returns the default variant when no keywords are supplied', async () => {
    const result = await getVariantForRequest();

    expect(result.variant).toBeDefined();
    expect(result.meta.variantId).toBe('default_master');
    expect(result.meta.matchType).toBe('default');

    const exposures = getExposureLog();
    expect(exposures).toHaveLength(1);
    expect(exposures[0]).toMatchObject({
      variantId: 'default_master',
      matchType: 'default'
    });
  });

  it('matches the romantic wedding variant for wedding search terms', async () => {
    const result = await getVariantForRequest({
      keywords: ['Bruiloft DJ in Brabant'],
      utmCampaign: 'wedding_campaign_q1'
    });

    expect(result.meta.variantId).toBe('romantic_wedding');
    expect(result.meta.matchType).toBe('manual');
    expect(result.variant.hero.title).toMatch(/soundtrack/i);
    expect(result.variant.pricing.highlightPackage).toBe('Zilver');
  });

  it('builds a city-specific variant when a city keyword is detected', async () => {
    const result = await getVariantForRequest({
      keywords: ['DJ Eindhoven bruiloft']
    });

    expect(result.meta.matchType).toBe('city');
    expect(result.meta.city).toBe('Eindhoven');
    expect(result.variant.id).toBe('city_dj-eindhoven');
    expect(result.variant.hero.title).toContain('Eindhoven');
    expect(result.variant.features.title).toContain('Eindhoven');
  });

  it('queues automation webhook retries when delivery fails and flushes successfully', async () => {
    config.personalization.automationWebhook = 'https://automation.test/hook';

    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve('internal-error')
      })
      .mockResolvedValue({
        ok: true,
        status: 200,
        text: () => Promise.resolve('ok')
      });
    global.fetch = fetchMock;

    db.isConfigured.mockReturnValue(true);
    db.runQuery.mockResolvedValue({ rows: [] });

    const result = await getVariantForRequest({ keywords: ['DJ Rotterdam feest'] });

    expect(result.meta.automationTriggered).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const retries = getAutomationRetryState();
    expect(retries).toHaveLength(1);
    expect(retries[0]).toMatchObject({
      status: 'queued',
      attempts: 0,
      lastError: expect.stringContaining('500')
    });

    expect(db.runQuery).toHaveBeenCalled();
    const [insertQuery, insertParams] = db.runQuery.mock.calls[0];
    expect(insertQuery).toContain('personalization_automation_retries');
    expect(insertParams[1]).toBe('queued');

    await flushAutomationQueue();

    expect(fetchMock.mock.calls.length).toBeGreaterThanOrEqual(2);
    const [updateQuery, updateParams] = db.runQuery.mock.calls.at(-1);
    expect(updateQuery).toContain('personalization_automation_retries');
    expect(updateParams[1]).toBe('delivered');

    const retriesAfterFlush = getAutomationRetryState();
    expect(retriesAfterFlush[0].status).toBe('delivered');
    expect(retriesAfterFlush[0].attempts).toBeGreaterThanOrEqual(1);
  });
});
