/**
 * Utility for GA4 event tracking.
 */

export const trackEvent = (eventName, eventParams = {}) => {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
    console.log(`GA4 Event Tracked: ${eventName}`, eventParams);
  } else {
    console.error('GA4 is not initialized.');
  }
};
