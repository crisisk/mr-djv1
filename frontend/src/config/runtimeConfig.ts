const sanitize = (value: string | undefined): string | null => {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed || trimmed === 'undefined' || trimmed === 'null') {
    return null;
  }

  if (/^YOUR_/i.test(trimmed)) {
    return null;
  }

  return trimmed;
};

const env = import.meta.env as Record<string, string | undefined>;

const fallbackPosthogHost = 'https://app.posthog.com';

export const FALLBACK_RETARGETING_CONFIG = {
  META_PIXEL_ID: null,
  GOOGLE_TAG_ID: null,
  LINKEDIN_PIXEL_ID: null,
};

export const runtimeConfig = {
  analytics: {
    posthog: {
      apiKey: sanitize(env.VITE_POSTHOG_API_KEY),
      apiHost: sanitize(env.VITE_POSTHOG_API_HOST) ?? fallbackPosthogHost,
    },
  },
  marketing: {
    metaPixelId: sanitize(env.VITE_META_PIXEL_ID),
    googleTagId: sanitize(env.VITE_GOOGLE_TAG_ID),
    linkedinPixelId: sanitize(env.VITE_LINKEDIN_PIXEL_ID),
    googleAdsConversionId: sanitize(env.VITE_GOOGLE_ADS_CONVERSION_ID),
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
