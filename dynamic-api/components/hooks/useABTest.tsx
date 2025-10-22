'use client';

import { useState, useEffect, useCallback } from 'react';

export interface VariantConfig {
  id: string;
  name: string;
  weight?: number;
  [key: string]: any; // Allow additional custom properties
}

interface UseABTestOptions {
  enabled?: boolean;
  autoTrackImpression?: boolean;
  debug?: boolean;
  onVariantAssigned?: (variant: VariantConfig) => void;
  onConversion?: (data: { variant: VariantConfig; eventName: string; value: number }) => void;
}

interface UseABTestReturn<T extends VariantConfig> {
  variant: { config: T } | null;
  trackConversion: (eventName: string, value?: number) => void;
  isLoading: boolean;
  error: Error | null;
  isControl: boolean;
}

export function useABTest<T extends VariantConfig = VariantConfig>(
  testId: string,
  options: UseABTestOptions = {}
): UseABTestReturn<T> {
  const [variant, setVariant] = useState<{ config: T } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!options.enabled) {
      setIsLoading(false);
      return;
    }

    try {
      // In a real implementation, this would fetch from an A/B testing service
      // For now, we'll use a simple mock
      const mockVariant: T = {
        id: testId,
        name: 'control',
        weight: 1,
      } as T;

      setVariant({ config: mockVariant });

      if (options.onVariantAssigned) {
        options.onVariantAssigned(mockVariant);
      }

      if (options.autoTrackImpression && options.debug) {
        console.log('[A/B Test] Impression tracked for:', testId);
      }

      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
    }
  }, [testId, options.enabled, options.autoTrackImpression, options.debug]);

  const trackConversion = useCallback(
    (eventName: string, value: number = 0) => {
      if (!variant) return;

      if (options.debug) {
        console.log('[A/B Test] Conversion tracked:', { testId, eventName, value });
      }

      if (options.onConversion) {
        options.onConversion({
          variant: variant.config,
          eventName,
          value,
        });
      }
    },
    [variant, testId, options]
  );

  return {
    variant,
    trackConversion,
    isLoading,
    error,
    isControl: variant?.config.name === 'control',
  };
}
