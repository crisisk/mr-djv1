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
      type: 'form_start',
      variantId,
      keyword: 'bruiloft dj',
      payload: {},
      context: { source: 'unit-test' }
    });

    await personalizationService.recordEvent({
      type: 'form_submit',
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
    expect(wedding.formStarts).toBeGreaterThanOrEqual(1);
    expect(wedding.formSubmits).toBeGreaterThanOrEqual(1);
    expect(analytics.totals.conversions).toBeGreaterThanOrEqual(1);
    expect(analytics.totals.formStarts).toBeGreaterThanOrEqual(1);
    expect(analytics.totals.formSubmits).toBeGreaterThanOrEqual(1);
  });

  it('summarises conversion stats across funnel steps', async () => {
    const match = await personalizationService.getVariantForRequest({
      keywords: ['feest dj'],
      keyword: 'feest dj'
    });
    const variantId = match.meta?.variantId || 'romantic_wedding';

    await personalizationService.recordEvent({
      type: 'cta_click',
      variantId,
      keyword: 'feest dj',
      payload: {},
      context: { source: 'unit-test' }
    });

    await personalizationService.recordEvent({
      type: 'form_start',
      variantId,
      keyword: 'feest dj',
      payload: {},
      context: { source: 'unit-test' }
    });

    await personalizationService.recordEvent({
      type: 'form_submit',
      variantId,
      keyword: 'feest dj',
      payload: { step: 'final' },
      context: { source: 'unit-test' }
    });

    await personalizationService.recordEvent({
      type: 'conversion',
      variantId,
      keyword: 'feest dj',
      payload: { revenue: 975 },
      context: { source: 'unit-test' }
    });

    const stats = await observabilityService.getConversionStats();
    expect(stats).toHaveProperty('totals');
    expect(stats.totals.conversionEvents).toBeGreaterThanOrEqual(1);
    expect(stats.totals.formSubmitEvents).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(stats.funnel)).toBe(true);
    expect(stats.funnel.find((step) => step.id === 'conversions').count).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(stats.topVariants)).toBe(true);
    expect(stats.topVariants[0]).toEqual(
      expect.objectContaining({ variantId, conversions: expect.any(Number) })
    );
    expect(Array.isArray(stats.recentConversions)).toBe(true);
  });
});
