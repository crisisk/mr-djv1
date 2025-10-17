const observabilityService = require('../services/observabilityService');
const personalizationService = require('../services/personalizationService');

describe('observabilityService', () => {
  beforeEach(() => {
    observabilityService.reset();
    personalizationService.resetLogs();
    personalizationService.resetCache();
  });

  afterEach(() => {
    observabilityService.reset();
    personalizationService.resetLogs();
  });

  it('processes scheduled runs and records metrics', async () => {
    await observabilityService.scheduleRun({ url: '/pricing', device: 'desktop' });
    await new Promise((resolve) => setTimeout(resolve, 100));

    const state = await observabilityService.getMonitoringState();
    expect(Array.isArray(state.runs)).toBe(true);
    expect(state.runs.length).toBeGreaterThan(0);
    const run = state.runs[0];
    expect(run).toEqual(expect.objectContaining({ url: '/pricing', device: 'desktop' }));
    expect(run.metrics).toEqual(
      expect.objectContaining({ performance: expect.any(Number), accessibility: expect.any(Number) })
    );
  });

  it('aggregates variant analytics from exposure and event logs', async () => {
    const match = await personalizationService.getVariantForRequest({
      keywords: ['bruiloft dj'],
      keyword: 'bruiloft dj'
    });
    const variantId = match.meta?.variantId || 'romantic_wedding';

    await personalizationService.recordEvent({
      type: 'cta_click',
      variantId,
      keyword: 'bruiloft dj',
      payload: {},
      context: { source: 'unit-test' }
    });

    await personalizationService.recordEvent({
      type: 'conversion',
      variantId,
      keyword: 'bruiloft dj',
      payload: { revenue: 1500 },
      context: { source: 'unit-test' }
    });

    const analytics = await observabilityService.getVariantAnalytics();
    expect(Array.isArray(analytics.variants)).toBe(true);
    const wedding = analytics.variants.find((variant) => variant.variantId === variantId);
    expect(wedding).toBeDefined();
    expect(wedding.exposures).toBeGreaterThan(0);
    expect(wedding.conversions).toBeGreaterThanOrEqual(1);
    expect(analytics.totals.conversions).toBeGreaterThanOrEqual(1);
  });
});
