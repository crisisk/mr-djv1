import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import HeroSection from '../HeroSection.jsx';

const PRIMARY_TEXT = 'Boek nu';
const SECONDARY_TEXT = 'Bekijk opties';

describe('HeroSection', () => {
  let pushSpy;

  beforeEach(() => {
    pushSpy = vi.fn();
    const fakeDataLayer = [];
    fakeDataLayer.push = pushSpy;
    window.dataLayer = fakeDataLayer;
  });

  afterEach(() => {
    delete window.dataLayer;
    vi.restoreAllMocks();
  });

  it('sends tracking events with metadata when CTAs are clicked', () => {
    render(
      <HeroSection
        title="Hero title"
        subtitle="Hero subtitle"
        ctaPrimaryText={PRIMARY_TEXT}
        ctaSecondaryText={SECONDARY_TEXT}
        variant="B"
      />
    );

    const primaryButton = screen.getByRole('button', { name: PRIMARY_TEXT });
    fireEvent.click(primaryButton);

    expect(pushSpy).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        event: 'cta_click',
        cta_type: 'primary',
        cta_text: PRIMARY_TEXT,
        variant: 'B',
        section: 'hero'
      })
    );

    const secondaryButton = screen.getByRole('button', { name: SECONDARY_TEXT });
    fireEvent.click(secondaryButton);

    expect(pushSpy).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        event: 'cta_click',
        cta_type: 'secondary',
        cta_text: SECONDARY_TEXT,
        variant: 'B',
        section: 'hero'
      })
    );
  });

  it("renders gradient background style and doesn't touch dataLayer without interactions", () => {
    const { container } = render(
      <HeroSection
        title="Gradient hero"
        subtitle="Showcasing gradient background"
        ctaPrimaryText={PRIMARY_TEXT}
        backgroundImage="https://example.com/hero.jpg"
      />
    );

    const heroRoot = container.firstChild;
    expect(heroRoot.style.backgroundImage).toContain('linear-gradient');
    expect(heroRoot.style.backgroundImage).toContain('url(https://example.com/hero.jpg)');
    expect(pushSpy).not.toHaveBeenCalled();
    expect(window.dataLayer).toHaveLength(0);
  });
});
