import { describe, expect, it } from 'vitest';
import { calculateOutcomes, PERSONA_PRESETS } from '../RoiCalculator.jsx';

describe('calculateOutcomes', () => {
  it('calculates investment, ROI and break-even leads for a persona', () => {
    const packages = [
      { id: 'bronze', price: 500 },
      { id: 'gold', price: 1200 }
    ];
    const input = {
      attendees: 200,
      conversionRate: 0.1,
      averageDealValue: 4000,
      nurtureTouchpoints: 2,
      persona: 'wedding'
    };

    const results = calculateOutcomes(packages, input);
    expect(results).toHaveLength(2);

    const bronze = results[0];
    expect(bronze.investment).toBe(560);
    expect(bronze.breakEvenLeads).toBe(1);
    expect(bronze.influencedRevenue).toBe(272000);
    expect(bronze.roi).toBeCloseTo(48471.43, 2);
  });

  it('falls back to corporate persona when none provided', () => {
    const packages = [{ id: 'bronze', price: 0 }];
    const input = {
      attendees: 100,
      conversionRate: 0.08,
      averageDealValue: 2500,
      nurtureTouchpoints: 1,
      persona: 'unknown'
    };

    const result = calculateOutcomes(packages, input)[0];
    const preset = PERSONA_PRESETS.corporate;
    const expectedRevenue = 100 * (input.conversionRate + preset.uplift) * input.averageDealValue;
    expect(result.influencedRevenue).toBe(expectedRevenue);
    expect(result.investment).toBe(preset.nurtureCost);
  });
});
