// src/components/marketing/YouTubeAdTracker.jsx
import { useEffect } from 'react';

const YouTubeAdTracker = () => {
  useEffect(() => {
    // Google Ads conversion tracking
    const loadGoogleAdsScript = () => {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=AW-CONVERSION_ID';
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(...args){dataLayer.push(args);} 
      gtag('js', new Date());
      gtag('config', 'AW-CONVERSION_ID');
    };

    loadGoogleAdsScript();
  }, []);

  return null;
};

export default YouTubeAdTracker;
