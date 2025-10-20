import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import PricingTables from '../PricingTables.jsx';
import { trackPricingCTA, getUserVariant } from '../../utils/trackConversion';

vi.mock('../../utils/trackConversion', () => ({
  trackPricingCTA: vi.fn(),
  getUserVariant: vi.fn(),
}));

describe('PricingTables', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('tracks CTA clicks with user variant and package details', async () => {
    const user = userEvent.setup();

    getUserVariant
      .mockReturnValueOnce('A')
      .mockReturnValueOnce('B')
      .mockReturnValueOnce('B');

    render(<PricingTables />);

    const meerInfoButton = screen.getByRole('button', { name: /meer info/i });
    const boekNuButton = screen.getByRole('button', { name: /boek nu/i });
    const vraagOfferteAanButton = screen.getByRole('button', { name: /vraag offerte aan/i });

    await user.click(meerInfoButton);
    await user.click(boekNuButton);
    await user.click(vraagOfferteAanButton);

    expect(trackPricingCTA).toHaveBeenNthCalledWith(1, 'A', 'Brons', '€495');
    expect(trackPricingCTA).toHaveBeenNthCalledWith(2, 'B', 'Zilver', '€795');
    expect(trackPricingCTA).toHaveBeenNthCalledWith(3, 'B', 'Goud', '€1.295');
  });

  it('matches the snapshot to guard featured styling', () => {
    const { container } = render(<PricingTables />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
