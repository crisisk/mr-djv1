/**
 * Custom React Hook for Replicate Image Generation
 *
 * Provides easy-to-use interface for AI image generation in components
 */

import { useState, useEffect, useCallback } from 'react';
import { getCachedOrGenerateImage, generateHeroImage, generateEventImage } from '../services/replicate';

/**
 * Hook for generating and managing AI images
 * @param {Object} options - Configuration options
 * @returns {Object} - Image state and generation function
 */
export function useReplicateImage(options = {}) {
  const [imageUrl, setImageUrl] = useState(options.placeholder || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateImage = useCallback(async (params) => {
    setIsLoading(true);
    setError(null);

    try {
      const cacheKey = JSON.stringify(params);
      const url = await getCachedOrGenerateImage(cacheKey, async () => {
        if (params.type === 'hero') {
          return await generateHeroImage(params);
        } else if (params.type === 'event') {
          return await generateEventImage(params);
        }
        throw new Error('Unknown image type');
      });

      setImageUrl(url);
      return url;
    } catch (err) {
      setError(err.message);
      console.error('Image generation error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    imageUrl,
    isLoading,
    error,
    generateImage,
    setImageUrl,
  };
}

/**
 * Hook for generating hero images with automatic caching
 */
export function useHeroImage({ city, eventType, autoGenerate = false }) {
  const { imageUrl, isLoading, error, generateImage } = useReplicateImage();

  useEffect(() => {
    if (autoGenerate && city) {
      generateImage({
        type: 'hero',
        city,
        eventType: eventType || 'feest',
      });
    }
  }, [city, eventType, autoGenerate, generateImage]);

  return { imageUrl, isLoading, error };
}

export default useReplicateImage;
