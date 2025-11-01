const sanitize = (value: string | undefined): string | null => {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed || trimmed === "undefined" || trimmed === "null") {
    return null;
  }

  if (/^YOUR_/i.test(trimmed)) {
    return null;
  }

  return trimmed;
};

const env = import.meta.env as Record<string, string | undefined>;

const fallbackPosthogHost = "https://app.posthog.com";
const defaultPosthogApiKey = "phc_mrdj_live_a7b8c9d0e1f2g3h4i5j6k7l8";
const defaultMarketingConfig = {
  metaPixelId: "987654321012345",
  googleTagId: "GTM-NST23HJX",
  linkedinPixelId: null,
  googleAdsConversionId: null,
} as const;
const defaultConsentConfig = {
  gtmId: "GTM-NST23HJX",
  ga4MeasurementId: "G-TXJLD3H2C8",
  complianzSiteId: "cmplz_a7f3b2c1d4e5",
} as const;

export const FALLBACK_RETARGETING_CONFIG = {
  META_PIXEL_ID: defaultMarketingConfig.metaPixelId,
  GOOGLE_TAG_ID: defaultMarketingConfig.googleTagId,
  LINKEDIN_PIXEL_ID: null,
};

export const runtimeConfig = {
  analytics: {
    posthog: {
      apiKey: sanitize(env.VITE_POSTHOG_API_KEY) ?? defaultPosthogApiKey,
      apiHost: sanitize(env.VITE_POSTHOG_API_HOST) ?? fallbackPosthogHost,
    },
  },
  marketing: {
    metaPixelId: sanitize(env.VITE_META_PIXEL_ID) ?? defaultMarketingConfig.metaPixelId,
    googleTagId: sanitize(env.VITE_GOOGLE_TAG_ID) ?? defaultMarketingConfig.googleTagId,
    linkedinPixelId: sanitize(env.VITE_LINKEDIN_PIXEL_ID) ?? defaultMarketingConfig.linkedinPixelId,
    googleAdsConversionId:
      sanitize(env.VITE_GOOGLE_ADS_CONVERSION_ID) ?? defaultMarketingConfig.googleAdsConversionId,
  },
  consent: {
    gtmId: sanitize(env.VITE_GTM_ID) ?? defaultConsentConfig.gtmId,
    ga4MeasurementId: sanitize(env.VITE_GA4_MEASUREMENT_ID) ?? defaultConsentConfig.ga4MeasurementId,
    complianzSiteId: sanitize(env.VITE_COMPLIANZ_SITE_ID) ?? defaultConsentConfig.complianzSiteId,
  },
} as const;

export const isValidPosthogKey = (apiKey: string | null): apiKey is string => {
  if (!apiKey) {
    return false;
  }

  return /^phc_[a-zA-Z0-9]+$/.test(apiKey) || /^[A-Za-z0-9_-]{32,}$/.test(apiKey);
};

export type PosthogRuntimeConfig = typeof runtimeConfig.analytics.posthog;
export type MarketingRuntimeConfig = typeof runtimeConfig.marketing;
export type ConsentRuntimeConfig = typeof runtimeConfig.consent;
