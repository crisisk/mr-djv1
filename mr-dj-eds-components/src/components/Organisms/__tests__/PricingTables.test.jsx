import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import PricingTables from '../PricingTables.jsx';
import { trackPricingCTA, getUserVariant } from '../../utils/trackConversion';

vi.mock('../../utils/trackConversion', () => ({
  trackPricingCTA: vi.fn(),
  getUserVariant: vi.fn(),
}));

describe('PricingTables', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getUserVariant.mockReset();
    trackPricingCTA.mockReset();
  });

  it('tracks CTA clicks with the expected package details', () => {
    getUserVariant
      .mockImplementationOnce(() => 'Variant-A')
      .mockImplementationOnce(() => 'Variant-B')
      .mockImplementationOnce(() => 'Variant-C');

    render(<PricingTables />);

    const packages = [
      { buttonText: 'Meer Info', name: 'Brons', price: '€495', variant: 'Variant-A' },
      { buttonText: 'Boek Nu', name: 'Zilver', price: '€795', variant: 'Variant-B' },
      { buttonText: 'Vraag Offerte Aan', name: 'Goud', price: '€1.295', variant: 'Variant-C' },
    ];

    packages.forEach(({ buttonText, name, price, variant }, index) => {
      const button = screen.getByRole('button', { name: buttonText });
      fireEvent.click(button);
      expect(trackPricingCTA).toHaveBeenNthCalledWith(index + 1, variant, name, price);
    });

    expect(trackPricingCTA).toHaveBeenCalledTimes(packages.length);

    const featuredBadge = screen.getByText('Populair');
    expect(featuredBadge).toMatchInlineSnapshot(`
      <div
        class="absolute top-0 right-0 bg-secondary text-[#1A2C4B] text-sm font-bold px-4 py-1 rounded-tr-lg rounded-bl-lg"
      >
        Populair
      </div>
    `);
  });
});
