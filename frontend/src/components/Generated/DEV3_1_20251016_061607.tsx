// src/components/analytics/HeatmapTracker.jsx
import { useEffect } from 'react';
import Head from 'next/head';

/**
 * Hotjar Heatmap Tracker Component
 * Initializes Hotjar tracking for user behavior analytics
 * 
 * @param {string} hotjarId - Hotjar Site ID
 * @param {string} hotjarSnippetVersion - Hotjar snippet version
 * @returns {JSX.Element} Script injection for Hotjar
 */
const HeatmapTracker = ({ hotjarId, hotjarSnippetVersion }) => {
  useEffect(() => {
    if (!hotjarId || !hotjarSnippetVersion) {
      console.error('Hotjar tracking disabled - missing ID or version');
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Hotjar tracking would be active in production');
      return;
    }

    try {
      // Hotjar tracking code
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:hotjarId,hjsv:hotjarSnippetVersion};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    } catch (error) {
      console.error('Hotjar initialization error:', error);
    }
  }, [hotjarId, hotjarSnippetVersion]);

  return (
    <Head>
      <script 
        dangerouslySetInnerHTML={{
          __html: `
            window._hjSettings = {
              hjid: ${hotjarId},
              hjsv: ${hotjarSnippetVersion}
            };
          `
        }}
      />
    </Head>
  );
};

export default HeatmapTracker;
