/**
 * Custom React Hook for TPW Widget Integration
 *
 * Handles widget lifecycle, loading, and cleanup
 */

import { useEffect, useRef, useState } from 'react';
import { initializeWidget, destroyWidget } from '../services/tpwWidget';

/**
 * Hook for TPW widget integration
 * @param {string} widgetType - Type of widget (booking, calendar, reviews)
 * @param {Object} options - Additional options
 * @returns {Object} - Widget state
 */
export function useTPWWidget(widgetType = 'booking', options = {}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);
  const containerIdRef = useRef(`tpw-widget-${Date.now()}`);

  useEffect(() => {
    const containerId = containerIdRef.current;

    // Initialize widget when container is ready
    if (containerRef.current && !isLoaded) {
      initializeWidget(containerId, widgetType)
        .then(() => {
          setIsLoaded(true);
        })
        .catch((err) => {
          setError(err.message);
          console.error('TPW Widget initialization failed:', err);
        });
    }

    // Cleanup on unmount
    return () => {
      if (isLoaded) {
        destroyWidget(containerId);
      }
    };
  }, [widgetType, isLoaded]);

  return {
    containerRef,
    containerId: containerIdRef.current,
    isLoaded,
    error,
  };
}

export default useTPWWidget;
