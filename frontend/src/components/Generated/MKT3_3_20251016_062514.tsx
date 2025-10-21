// src/config/retargeting.js
import { FALLBACK_RETARGETING_CONFIG, runtimeConfig } from '../../config/runtimeConfig';

const { marketing } = runtimeConfig;

export const RETARGETING_CONFIG = {
  META_PIXEL_ID: marketing.metaPixelId ?? FALLBACK_RETARGETING_CONFIG.META_PIXEL_ID,
  GOOGLE_TAG_ID: marketing.googleTagId ?? FALLBACK_RETARGETING_CONFIG.GOOGLE_TAG_ID,
  LINKEDIN_PIXEL_ID: marketing.linkedinPixelId ?? FALLBACK_RETARGETING_CONFIG.LINKEDIN_PIXEL_ID,
} as const;
