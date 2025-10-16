import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const ConsentContext = createContext(null);

const getInitialConsent = () => {
  if (typeof window === 'undefined') {
    return {
      ad_storage: false,
      analytics_storage: false,
      ad_user_data: false,
      ad_personalization: false,
    };
  }

  if (window.complianz?.user_preferences) {
    const prefs = window.complianz.user_preferences;
    return {
      ad_storage: prefs.marketing === 'allow',
      analytics_storage: prefs.statistics === 'allow',
      ad_user_data: prefs.marketing === 'allow',
      ad_personalization: prefs.marketing === 'allow',
    };
  }

  return {
    ad_storage: false,
    analytics_storage: false,
    ad_user_data: false,
    ad_personalization: false,
  };
};

const pushConsentToDataLayer = (consent) => {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'consent_update',
    event_timestamp: new Date().toISOString(),
    ...consent,
  });

  if (window.gtag) {
    window.gtag('consent', 'update', consent);
  }
};

export const ConsentManager = ({ children, showControls = false }) => {
  const [consent, setConsent] = useState(getInitialConsent);

  const updateConsent = (partial) => {
    setConsent((prev) => ({ ...prev, ...partial }));
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const handleConsentChange = () => {
      const next = getInitialConsent();
      setConsent(next);
    };

    window.addEventListener('cmplz_fire_categories', handleConsentChange);
    handleConsentChange();

    return () => window.removeEventListener('cmplz_fire_categories', handleConsentChange);
  }, []);

  useEffect(() => {
    pushConsentToDataLayer(consent);
  }, [consent]);

  const value = useMemo(
    () => ({
      ...consent,
      setConsent: updateConsent,
      isAllowed: (category) => Boolean(consent[category]),
    }),
    [consent]
  );

  return (
    <ConsentContext.Provider value={value}>
      {showControls && (
        <div className="fixed bottom-spacing-lg right-spacing-lg z-50 space-y-spacing-sm rounded-2xl border border-neutral-gray-100 bg-neutral-light/95 p-spacing-lg shadow-2xl">
          <p className="text-font-size-small font-semibold text-neutral-dark">Consent toggles (design system)</p>
          {[
            ['analytics_storage', 'Analytics'],
            ['ad_storage', 'Advertenties opslaan'],
            ['ad_user_data', 'Advertentie-gebruiksdata'],
            ['ad_personalization', 'Advertentie-personalisatie'],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center justify-between gap-spacing-md text-font-size-small">
              <span>{label}</span>
              <input
                type="checkbox"
                checked={Boolean(consent[key])}
                onChange={(event) =>
                  updateConsent({
                    [key]: event.target.checked,
                  })
                }
              />
            </label>
          ))}
        </div>
      )}
      {children}
    </ConsentContext.Provider>
  );
};

export const useConsent = () => {
  const context = useContext(ConsentContext);
  if (context === undefined || context === null) {
    throw new Error('useConsent must be used within a ConsentManager');
  }
  return context;
};
