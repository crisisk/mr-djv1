import { getWindow } from './environment.js';

const DEFAULT_CONSENT_STATE = Object.freeze({
  ad_storage: false,
  analytics_storage: false,
  ad_user_data: false,
  ad_personalization: false
});

function readComplianzPreferences() {
  const browser = getWindow();
  if (!browser) {
    return null;
  }

  const prefs = browser.complianz?.user_preferences;
  if (!prefs) {
    return null;
  }

  return {
    ad_storage: prefs.marketing === 'allow',
    analytics_storage: prefs.statistics === 'allow',
    ad_user_data: prefs.marketing === 'allow',
    ad_personalization: prefs.marketing === 'allow'
  };
}

export function getInitialConsent() {
  const complianz = readComplianzPreferences();
  if (complianz) {
    return complianz;
  }

  return { ...DEFAULT_CONSENT_STATE };
}

export function pushConsentToDataLayer(consent) {
  const browser = getWindow();
  if (!browser) return;

  browser.dataLayer = browser.dataLayer || [];
  browser.dataLayer.push({
    event: 'consent_update',
    event_timestamp: new Date().toISOString(),
    ...consent
  });

  if (typeof browser.gtag === 'function') {
    browser.gtag('consent', 'update', consent);
  }
}

export function createConsentStateUpdater(setter) {
  return (partial) => {
    setter((prev) => ({ ...prev, ...partial }));
  };
}

export function subscribeToComplianz(onChange) {
  const browser = getWindow();
  if (!browser) {
    return () => {};
  }

  const handler = () => {
    const next = getInitialConsent();
    onChange(next);
  };

  browser.addEventListener('cmplz_fire_categories', handler);
  handler();

  return () => {
    browser.removeEventListener('cmplz_fire_categories', handler);
  };
}

export { DEFAULT_CONSENT_STATE };
