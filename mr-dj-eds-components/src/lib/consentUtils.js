const DEFAULT_CONSENT_STATE = Object.freeze({
  ad_storage: false,
  analytics_storage: false,
  ad_user_data: false,
  ad_personalization: false
});

function readComplianzPreferences() {
  if (typeof window === 'undefined') {
    return null;
  }

  const prefs = window.complianz?.user_preferences;
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
  if (typeof window === 'undefined') {
    return { ...DEFAULT_CONSENT_STATE };
  }

  const complianz = readComplianzPreferences();
  if (complianz) {
    return complianz;
  }

  return { ...DEFAULT_CONSENT_STATE };
}

export function pushConsentToDataLayer(consent) {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'consent_update',
    event_timestamp: new Date().toISOString(),
    ...consent
  });

  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', consent);
  }
}

export function createConsentStateUpdater(setter) {
  return (partial) => {
    setter((prev) => ({ ...prev, ...partial }));
  };
}

export function subscribeToComplianz(onChange) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handler = () => {
    const next = getInitialConsent();
    onChange(next);
  };

  window.addEventListener('cmplz_fire_categories', handler);
  handler();

  return () => {
    window.removeEventListener('cmplz_fire_categories', handler);
  };
}

export { DEFAULT_CONSENT_STATE };
