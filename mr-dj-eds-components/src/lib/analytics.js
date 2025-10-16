export const trackEvent = (event, detail = {}) => {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    event_timestamp: new Date().toISOString(),
    ...detail,
  });
};
