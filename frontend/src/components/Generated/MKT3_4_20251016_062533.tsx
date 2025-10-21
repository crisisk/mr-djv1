// src/components/marketing/YouTubeAdTracker.jsx
import { useEffect } from 'react';
import { runtimeConfig } from '../../config/runtimeConfig';

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

let googleAdsInitialized = false;

const YouTubeAdTracker = () => {
  useEffect(() => {
    const conversionId = runtimeConfig.marketing.googleAdsConversionId;

    if (!conversionId) {
      console.warn('Google Ads tracking overgeslagen: geen conversie-ID geconfigureerd.');
      return;
    }

    if (googleAdsInitialized) {
      console.debug('Google Ads script is al geladen; dubbele initialisatie wordt voorkomen.');
      return;
    }

    let isUnmounted = false;

    const loadGoogleAdsScript = () =>
      new Promise<void>((resolve, reject) => {
        const existingScript = document.querySelector(
          `script[data-google-ads-id="${conversionId}"]`
        ) as HTMLScriptElement | null;

        if (existingScript) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${conversionId}`;
        script.dataset.googleAdsId = conversionId;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Google Ads script failed to load.'));

        document.head.appendChild(script);
      });

    loadGoogleAdsScript()
      .then(() => {
        if (isUnmounted) {
          return;
        }

        window.dataLayer = window.dataLayer || [];
        const gtag = (...args: unknown[]) => {
          window.dataLayer?.push(args);
        };

        gtag('js', new Date());
        gtag('config', conversionId);
        googleAdsInitialized = true;
      })
      .catch((error) => {
        if (!isUnmounted) {
          console.error('Het laden van het Google Ads script is mislukt.', error);
        }
      });

    return () => {
      isUnmounted = true;
    };
  }, []);

  return null;
};

export default YouTubeAdTracker;
