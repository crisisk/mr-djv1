const {
  getVariantForRequest,
  resetLogs,
  resetCache,
  getExposureLog
} = require('../services/personalizationService');

describe('personalizationService', () => {
  beforeEach(async () => {
    resetLogs();
    await resetCache();
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
});
