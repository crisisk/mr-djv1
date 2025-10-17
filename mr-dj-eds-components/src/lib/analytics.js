import { getWindow } from './environment.js';

export const trackEvent = (event, detail = {}) => {
  const browser = getWindow();
  if (!browser) return;
  browser.dataLayer = browser.dataLayer || [];
  browser.dataLayer.push({
    event,
    event_timestamp: new Date().toISOString(),
    ...detail
  });
};
