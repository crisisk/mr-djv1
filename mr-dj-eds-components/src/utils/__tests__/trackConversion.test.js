import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  trackFormSubmission,
  trackPhoneClick,
  trackQuoteRequest,
  trackAvailabilityCheck,
  trackPricingCTA,
  trackContactNavigation,
  trackButtonClick,
  trackWhatsAppClick,
  setUserVariant,
  getUserVariant
} from '../trackConversion';
import { setupDomMocks } from './testUtils';

let environment;

beforeEach(() => {
  environment = setupDomMocks();
});

afterEach(() => {
  const { storage, document, dataLayer, location } = environment;
  storage.clear();
  document.__clear();
  if (dataLayer) {
    dataLayer.length = 0;
  }
  if (location) {
    location.search = '';
  }
  environment.restore();
  environment = undefined;
});

describe('trackConversion utilities', () => {
  const expectEventShape = (expected) => {
    expect(window.dataLayer).toHaveLength(1);
    const event = window.dataLayer[0];

    expect(event).toMatchObject(expected);
    expect(typeof event.timestamp).toBe('string');
    expect(new Date(event.timestamp).toString()).not.toBe('Invalid Date');
  };

  it('pushes correct payload for trackFormSubmission', () => {
    trackFormSubmission('B', 'wedding', 'availability');

    expectEventShape({
      event: 'conversion',
      conversion_type: 'form_submit',
      form_type: 'availability',
      variant: 'B',
      event_type: 'wedding',
      value: 1,
      currency: 'EUR'
    });
  });

  it('pushes correct payload for trackPhoneClick', () => {
    trackPhoneClick('A', 'footer');

    expectEventShape({
      event: 'conversion',
      conversion_type: 'phone_click',
      variant: 'A',
      click_location: 'footer',
      value: 1,
      currency: 'EUR'
    });
  });

  it('pushes correct payload for trackQuoteRequest', () => {
    trackQuoteRequest('B', 'corporate');

    expectEventShape({
      event: 'conversion',
      conversion_type: 'quote_request',
      variant: 'B',
      event_type: 'corporate',
      value: 1,
      currency: 'EUR'
    });
  });

  it('pushes correct payload for trackAvailabilityCheck', () => {
    trackAvailabilityCheck('A', '2025-05-05');

    expectEventShape({
      event: 'conversion',
      conversion_type: 'availability_check',
      variant: 'A',
      selected_date: '2025-05-05',
      value: 1,
      currency: 'EUR'
    });
  });

  it('pushes correct payload for trackPricingCTA', () => {
    trackPricingCTA('B', 'Zilver', '€999');

    expectEventShape({
      event: 'conversion',
      conversion_type: 'pricing_cta',
      variant: 'B',
      package_name: 'zilver',
      package_price: '€999',
      value: 1,
      currency: 'EUR'
    });
  });

  it('pushes correct payload for trackContactNavigation', () => {
    trackContactNavigation('A', 'hero_banner');

    expectEventShape({
      event: 'conversion',
      conversion_type: 'contact_navigation',
      variant: 'A',
      navigation_source: 'hero_banner',
      value: 1,
      currency: 'EUR'
    });
  });

  it('pushes correct payload for trackButtonClick', () => {
    trackButtonClick('B', 'Check availability', 'hero');

    expectEventShape({
      event: 'button_click',
      variant: 'B',
      button_text: 'Check availability',
      button_location: 'hero'
    });
  });

  it('pushes correct payload for trackWhatsAppClick', () => {
    trackWhatsAppClick('A');

    expectEventShape({
      event: 'conversion',
      conversion_type: 'whatsapp_click',
      variant: 'A',
      value: 1,
      currency: 'EUR'
    });
  });

  it('stores the variant in session storage and pushes an event when setUserVariant is called', () => {
    setUserVariant('B');

    expect(sessionStorage.setItem).toHaveBeenCalledWith('ab_variant', 'B');
    expectEventShape({
      event: 'ab_variant_set',
      variant: 'B'
    });
  });

  it('returns the stored variant from session storage when available', () => {
    sessionStorage.setItem('ab_variant', 'B');

    const variant = getUserVariant();

    expect(variant).toBe('B');
    expect(window.dataLayer).toHaveLength(0);
  });

  it('hydrates session storage from cookies when necessary', () => {
    document.cookie = 'mr_dj_ab_variant=B';

    const variant = getUserVariant();

    expect(variant).toBe('B');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('ab_variant', 'B');
  });

  it('defaults to variant A when no information is stored', () => {
    const variant = getUserVariant();

    expect(variant).toBe('A');
  });
});
