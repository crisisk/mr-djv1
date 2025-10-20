import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import HeroSection from '../HeroSection.jsx';

describe('HeroSection GTM tracking', () => {
  let originalDataLayer;
  let pushSpy;

  beforeEach(() => {
    originalDataLayer = window.dataLayer;
    pushSpy = vi.fn();
    window.dataLayer = { push: pushSpy };
  });

  afterEach(() => {
    cleanup();
    window.dataLayer = originalDataLayer;
    pushSpy.mockReset();
  });

  it('pushes a GTM event with metadata when the primary CTA is clicked', () => {
    render(
      <HeroSection
        title="Plan Your Event"
        subtitle="Let us handle the music."
        ctaPrimaryText="Book now"
        ctaSecondaryText="Contact us"
        variant="B"
      />
    );

    const primaryButton = screen.getByRole('button', { name: /book now/i });
    fireEvent.click(primaryButton);

    expect(pushSpy).toHaveBeenCalledTimes(1);
    expect(pushSpy).toHaveBeenCalledWith({
      event: 'cta_click',
      cta_type: 'primary',
      cta_text: 'Book now',
      variant: 'B',
      section: 'hero'
    });
  });

  it('pushes a GTM event with metadata when the secondary CTA is clicked', () => {
    render(
      <HeroSection
        title="Plan Your Event"
        subtitle="Let us handle the music."
        ctaPrimaryText="Book now"
        ctaSecondaryText="Get a quote"
        variant="C"
      />
    );

    const secondaryButton = screen.getByRole('button', { name: /get a quote/i });
    fireEvent.click(secondaryButton);

    expect(pushSpy).toHaveBeenCalledTimes(1);
    expect(pushSpy).toHaveBeenCalledWith({
      event: 'cta_click',
      cta_type: 'secondary',
      cta_text: 'Get a quote',
      variant: 'C',
      section: 'hero'
    });
  });

  it('renders gradient background styles without mutating dataLayer when CTAs are not clicked', () => {
    const imageUrl = 'https://example.com/background.jpg';

    const { container } = render(
      <HeroSection
        title="Plan Your Event"
        subtitle="Let us handle the music."
        ctaPrimaryText="Book now"
        ctaSecondaryText="Contact us"
        backgroundImage={imageUrl}
      />
    );

    const heroSection = container.firstChild;

    expect(heroSection).toHaveStyle({
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    });

    expect(pushSpy).not.toHaveBeenCalled();
  });
});
