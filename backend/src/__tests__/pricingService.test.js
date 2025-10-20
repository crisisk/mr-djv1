const { buildRequiredEnv } = require('../testUtils/env');

const ORIGINAL_ENV = { ...process.env };
process.env = { ...ORIGINAL_ENV, ...buildRequiredEnv() };

jest.mock('../services/packageService', () => ({
  getPackages: jest.fn()
}));

const packageService = require('../services/packageService');
const { calculateQuote, resetExtrasCache } = require('../services/pricingService');

describe('pricingService.calculateQuote', () => {
  beforeEach(() => {
    resetExtrasCache();
    jest.clearAllMocks();
    packageService.getPackages.mockResolvedValue({
      packages: [
        { id: 'silver', name: 'Zilver Pakket', price: 995 },
        { id: 'gold', name: 'Goud Pakket', price: 1295 }
      ],
      source: 'test',
      cacheStatus: 'miss'
    });
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('returns a pricing breakdown with extras and travel fees', async () => {
    const quote = await calculateQuote({
      packageId: 'gold',
      location: 'Amsterdam',
      extras: ['photobooth']
    });

    expect(packageService.getPackages).toHaveBeenCalled();
    expect(quote).toMatchObject({
      currency: 'EUR',
      package: { id: 'gold', name: 'Goud Pakket', price: 1295 },
      location: expect.objectContaining({
        input: 'Amsterdam',
        travelFee: expect.any(Number)
      })
    });
    expect(quote.extras).toEqual([
      expect.objectContaining({ id: 'photobooth', price: 400 })
    ]);
    expect(quote.totals).toMatchObject({
      base: 1295,
      extras: 400,
      travel: expect.any(Number),
      grandTotal: expect.any(Number)
    });
    expect(quote.totals.grandTotal).toBe(
      quote.totals.base + quote.totals.extras + quote.totals.travel
    );
  });

  it('throws a PricingError when the package cannot be found', async () => {
    await expect(
      calculateQuote({ packageId: 'platinum', location: 'Amsterdam', extras: [] })
    ).rejects.toEqual(
      expect.objectContaining({
        name: 'PricingError',
        statusCode: 404,
        details: { packageId: 'platinum' }
      })
    );
  });

  it('throws a PricingError when an unknown extra is requested', async () => {
    await expect(
      calculateQuote({ packageId: 'gold', location: null, extras: ['unknown-addon'] })
    ).rejects.toEqual(
      expect.objectContaining({
        name: 'PricingError',
        statusCode: 404,
        details: { extraId: 'unknown-addon' }
      })
    );
  });

  it('returns zero travel fee when no location is provided', async () => {
    const quote = await calculateQuote({ packageId: 'gold', location: '', extras: [] });

    expect(quote.location).toMatchObject({
      input: null,
      travelFee: 0,
      zone: 'unspecified'
    });
    expect(quote.totals.travel).toBe(0);
    expect(quote.totals.grandTotal).toBe(quote.totals.base);
  });
});
