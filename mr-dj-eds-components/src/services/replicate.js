/**
 * Replicate AI API Service
 *
 * Integrates Replicate API for AI-powered image generation
 * Used for hero images, event visuals, and dynamic content creation
 */

import { getWindow, isBrowser } from '../lib/environment.js';

const REPLICATE_API_KEY = 'r8_F37uDRCZQ92lMBuJKJ5b5EM0xHH9vnZ2EDXMN';
const REPLICATE_API_URL = 'https://api.replicate.com/v1';

/**
 * Available Replicate models for different use cases
 */
export const REPLICATE_MODELS = {
  // FLUX Pro 1.1 - Best quality for hero images
  FLUX_PRO: 'black-forest-labs/flux-1.1-pro',

  // FLUX Schnell - Fast generation for real-time preview
  FLUX_SCHNELL: 'black-forest-labs/flux-schnell',

  // Stable Diffusion XL - High quality photorealistic images
  SDXL: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',

  // Ideogram v2 - Best for text in images
  IDEOGRAM_V2: 'ideogram-ai/ideogram-v2',

  // Recraft V3 - Best for design and branding
  RECRAFT_V3: 'recraft-ai/recraft-v3',
};

/**
 * Generic Replicate API request
 */
async function replicateRequest(endpoint, options = {}) {
  const url = `${REPLICATE_API_URL}${endpoint}`;

  const config = {
    headers: {
      'Authorization': `Bearer ${REPLICATE_API_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'wait',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || `Replicate API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Replicate API Error:', error);
    throw error;
  }
}

/**
 * Generate hero image for a specific city/event
 * @param {Object} params - Generation parameters
 * @param {string} params.city - City name (e.g., "Amsterdam")
 * @param {string} params.eventType - Event type (e.g., "bruiloft", "bedrijfsfeest")
 * @param {string} params.style - Image style (e.g., "professional", "festive", "elegant")
 * @param {string} params.model - Replicate model to use
 * @returns {Promise<string>} - Image URL
 */
export async function generateHeroImage({ city, eventType = 'feest', style = 'professional', model = REPLICATE_MODELS.FLUX_PRO }) {
  const prompts = {
    bruiloft: `Professional elegant wedding DJ setup at a beautiful venue in ${city}, Netherlands, with romantic lighting, turntables, and saxophonist silhouette, cinematic photography, 8k, ultra detailed`,
    bedrijfsfeest: `Modern corporate event DJ booth at a professional venue in ${city}, with sleek lighting, branded backdrop, dancing crowd, high-end equipment, professional photography`,
    verjaardag: `Vibrant birthday party DJ setup in ${city} with colorful lighting, confetti, energetic atmosphere, celebration vibes, professional event photography`,
    feest: `Professional DJ performing at an upscale event venue in ${city}, Netherlands, with dynamic lighting effects, modern equipment, enthusiastic crowd, cinematic shot, 8k resolution`,
  };

  const basePrompt = prompts[eventType] || prompts.feest;
  const prompt = style ? `${basePrompt}, styled as ${style}` : basePrompt;

  const input = {
    prompt: prompt,
    aspect_ratio: '16:9',
    output_format: 'webp',
    output_quality: 90,
    safety_tolerance: 2,
  };

  const prediction = await replicateRequest('/predictions', {
    method: 'POST',
    body: JSON.stringify({
      version: model.split(':')[1] || model,
      input: input,
    }),
  });

  // Poll for result
  return await waitForPrediction(prediction.id);
}

/**
 * Generate event portfolio image
 * @param {Object} params - Generation parameters
 * @returns {Promise<string>} - Image URL
 */
export async function generateEventImage({ prompt, aspectRatio = '4:3', model = REPLICATE_MODELS.FLUX_SCHNELL }) {
  const input = {
    prompt: `Professional event photography: ${prompt}, high quality, 8k, cinematic lighting`,
    aspect_ratio: aspectRatio,
    output_format: 'webp',
    output_quality: 85,
  };

  const prediction = await replicateRequest('/predictions', {
    method: 'POST',
    body: JSON.stringify({
      version: model.split(':')[1] || model,
      input: input,
    }),
  });

  return await waitForPrediction(prediction.id);
}

/**
 * Generate mood board / event design visual
 * @param {Object} params - Design parameters
 * @returns {Promise<string>} - Image URL
 */
export async function generateMoodBoard({ colors, theme, eventType, model = REPLICATE_MODELS.RECRAFT_V3 }) {
  const prompt = `Professional event design mood board for ${eventType}, color palette: ${colors.join(', ')}, theme: ${theme}, elegant layout, Pinterest style, high-end design`;

  const input = {
    prompt: prompt,
    style: 'digital_illustration',
    size: '1024x1024',
  };

  const prediction = await replicateRequest('/predictions', {
    method: 'POST',
    body: JSON.stringify({
      version: model,
      input: input,
    }),
  });

  return await waitForPrediction(prediction.id);
}

/**
 * Generate promotional social media image with text
 * @param {Object} params - Image parameters
 * @returns {Promise<string>} - Image URL
 */
export async function generatePromoImage({ city, offer, date, model = REPLICATE_MODELS.IDEOGRAM_V2 }) {
  const prompt = `Professional DJ promotional poster for ${city}, text: "DJ Huren ${city}", special offer: "${offer}", event date: ${date}, modern design, vibrant colors, party atmosphere, high quality typography`;

  const input = {
    prompt: prompt,
    aspect_ratio: '1:1',
    magic_prompt_option: 'Auto',
  };

  const prediction = await replicateRequest('/predictions', {
    method: 'POST',
    body: JSON.stringify({
      version: model,
      input: input,
    }),
  });

  return await waitForPrediction(prediction.id);
}

/**
 * Wait for prediction to complete
 * @param {string} predictionId - Prediction ID
 * @returns {Promise<string>} - Output image URL
 */
async function waitForPrediction(predictionId, maxAttempts = 60) {
  let attempts = 0;

  while (attempts < maxAttempts) {
    const prediction = await replicateRequest(`/predictions/${predictionId}`);

    if (prediction.status === 'succeeded') {
      return Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
    }

    if (prediction.status === 'failed') {
      throw new Error('Image generation failed: ' + prediction.error);
    }

    // Wait 1 second before checking again
    await new Promise(resolve => setTimeout(resolve, 1000));
    attempts++;
  }

  throw new Error('Image generation timeout');
}

/**
 * Generate batch of images for a city landing page
 * @param {Object} params - Page parameters
 * @returns {Promise<Object>} - Object with hero, gallery, and promo images
 */
export async function generateCityLandingPageImages({ city, eventType = 'feest' }) {
  try {
    const [heroImage, galleryImage1, galleryImage2, galleryImage3] = await Promise.all([
      generateHeroImage({ city, eventType, style: 'professional' }),
      generateEventImage({
        prompt: `DJ performing at wedding in ${city}, romantic atmosphere, elegant lighting`
      }),
      generateEventImage({
        prompt: `Corporate event DJ setup in ${city}, professional environment, modern lighting`
      }),
      generateEventImage({
        prompt: `Birthday party DJ in ${city}, colorful atmosphere, celebration vibes`
      }),
    ]);

    return {
      hero: heroImage,
      gallery: [galleryImage1, galleryImage2, galleryImage3],
      success: true,
    };
  } catch (error) {
    console.error('Failed to generate images for', city, error);
    return {
      hero: null,
      gallery: [],
      success: false,
      error: error.message,
    };
  }
}

/**
 * Cache-aware image generation
 * Checks localStorage cache before generating new images
 */
export async function getCachedOrGenerateImage(cacheKey, generatorFn) {
  const win = getWindow();
  const canUseStorage = isBrowser() && win?.localStorage;

  if (canUseStorage) {
    try {
      const cached = win.localStorage.getItem(`replicate_${cacheKey}`);
      if (cached) {
        const { url, timestamp } = JSON.parse(cached);
        if (url && timestamp && Date.now() - timestamp < 7 * 24 * 60 * 60 * 1000) {
          return url;
        }
      }
    } catch (error) {
      console.warn('Kon Replicate cache niet lezen, genereer nieuwe afbeelding', error);
    }
  }

  const url = await generatorFn();

  if (canUseStorage && url) {
    try {
      win.localStorage.setItem(
        `replicate_${cacheKey}`,
        JSON.stringify({
          url,
          timestamp: Date.now(),
        }),
      );
    } catch (error) {
      console.warn('Kon Replicate afbeelding niet cachen', error);
    }
  }

  return url;
}

export default {
  generateHeroImage,
  generateEventImage,
  generateMoodBoard,
  generatePromoImage,
  generateCityLandingPageImages,
  getCachedOrGenerateImage,
  REPLICATE_MODELS,
};
