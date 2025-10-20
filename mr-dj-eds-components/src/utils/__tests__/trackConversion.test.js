import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
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
} from '../trackConversion.js';

const FIXED_DATE = new Date('2024-01-01T00:00:00.000Z');

describe('trackConversion utilities', () => {
  let cookieStore;
  let pushSpy;
  let sessionStorageMock;

  const createSessionStorage = () => {
    let store = {};
    return {
      getItem: vi.fn((key) => (key in store ? store[key] : null)),
      setItem: vi.fn((key, value) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
      getStore: () => store
    };
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_DATE);

    cookieStore = {};

    const documentMock = {};
    Object.defineProperty(documentMock, 'cookie', {
      configurable: true,
      get: () =>
        Object.entries(cookieStore)
          .map(([key, value]) => `${key}=${value}`)
          .join('; '),
      set: (value) => {
        const [pair] = value.split(';');
        const [rawKey, rawVal] = pair.split('=');
        const key = rawKey?.trim();
        const val = rawVal;

        if (!key) {
          return;
        }

        const expiresMatch = value.match(/expires=([^;]+)/i);
        if (expiresMatch) {
          const expiresDate = new Date(expiresMatch[1]);
          if (Number.isNaN(expiresDate.getTime()) || expiresDate < new Date()) {
            delete cookieStore[key];
            return;
          }
        }

        if (typeof val === 'undefined' || val === '') {
          delete cookieStore[key];
          return;
        }

        cookieStore[key] = val;
      }
    });

    sessionStorageMock = createSessionStorage();

    globalThis.document = documentMock;
    globalThis.window = {
      dataLayer: [],
      sessionStorage: sessionStorageMock,
      location: { search: '', pathname: '/' }
    };
    globalThis.sessionStorage = sessionStorageMock;

    pushSpy = vi.spyOn(window.dataLayer, 'push');
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    sessionStorageMock.clear();
    cookieStore = {};
    if (globalThis.window) {
      globalThis.window.location.search = '';
    }
    delete globalThis.window;
    delete globalThis.sessionStorage;
    delete globalThis.document;
  });

  const expectPushWith = (expected) => {
    expect(pushSpy).toHaveBeenCalledTimes(1);
    expect(pushSpy).toHaveBeenCalledWith({
      ...expected,
      timestamp: FIXED_DATE.toISOString()
    });
  };

  it('tracks form submissions with the expected payload', () => {
    trackFormSubmission('B', 'wedding', 'contact');

    expectPushWith({
      event: 'conversion',
      conversion_type: 'form_submit',
      form_type: 'contact',
      variant: 'B',
      event_type: 'wedding',
      value: 1,
      currency: 'EUR'
    });
  });

  it('tracks phone clicks with the expected payload', () => {
    trackPhoneClick('A', 'header');

    expectPushWith({
      event: 'conversion',
      conversion_type: 'phone_click',
      variant: 'A',
      click_location: 'header',
      value: 1,
      currency: 'EUR'
    });
  });

  it('tracks quote requests with the expected payload', () => {
    trackQuoteRequest('B', 'corporate');

    expectPushWith({
      event: 'conversion',
      conversion_type: 'quote_request',
      variant: 'B',
      event_type: 'corporate',
      value: 1,
      currency: 'EUR'
    });
  });

  it('tracks availability checks with the expected payload', () => {
    trackAvailabilityCheck('A', '2024-02-14');

    expectPushWith({
      event: 'conversion',
      conversion_type: 'availability_check',
      variant: 'A',
      selected_date: '2024-02-14',
      value: 1,
      currency: 'EUR'
    });
  });

  it('tracks pricing CTA clicks with normalized package data', () => {
    trackPricingCTA('B', 'Zilver', '€1200');

    expectPushWith({
      event: 'conversion',
      conversion_type: 'pricing_cta',
      variant: 'B',
      package_name: 'zilver',
      package_price: '€1200',
      value: 1,
      currency: 'EUR'
    });
  });

  it('tracks contact navigation with the expected payload', () => {
    trackContactNavigation('A', 'footer');

    expectPushWith({
      event: 'conversion',
      conversion_type: 'contact_navigation',
      variant: 'A',
      navigation_source: 'footer',
      value: 1,
      currency: 'EUR'
    });
  });

  it('tracks generic button clicks', () => {
    trackButtonClick('B', 'Contact', 'hero');

    expectPushWith({
      event: 'button_click',
      variant: 'B',
      button_text: 'Contact',
      button_location: 'hero'
    });
  });

  it('tracks WhatsApp clicks as conversions', () => {
    trackWhatsAppClick('A');

    expectPushWith({
      event: 'conversion',
      conversion_type: 'whatsapp_click',
      variant: 'A',
      value: 1,
      currency: 'EUR'
    });
  });

  it('sets the user variant and pushes to the dataLayer', () => {
    setUserVariant('B');

    expect(sessionStorage.getItem('ab_variant')).toBe('B');
    expectPushWith({
      event: 'ab_variant_set',
      variant: 'B'
    });
  });

  it('returns the variant from session storage when available', () => {
    sessionStorage.setItem('ab_variant', 'B');

    const result = getUserVariant();

    expect(result).toBe('B');
    expect(pushSpy).not.toHaveBeenCalled();
  });

  it('hydrates session storage from cookies when no session value exists', () => {
    document.cookie = 'mr_dj_ab_variant=B';
    sessionStorage.clear();

    const result = getUserVariant();

    expect(result).toBe('B');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('ab_variant', 'B');
    expect(pushSpy).not.toHaveBeenCalled();
  });

  it('falls back to variant A when no stored variant is found', () => {
    sessionStorage.clear();

    const result = getUserVariant();

    expect(result).toBe('A');
    expect(pushSpy).not.toHaveBeenCalled();
  });
});
