import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  getInitialConsent,
  pushConsentToDataLayer,
  createConsentStateUpdater,
  subscribeToComplianz
} from '../lib/consentUtils.js';

const ConsentContext = createContext(null);

export const ConsentManager = ({ children, showControls = false }) => {
  const [consent, setConsent] = useState(() => getInitialConsent());
  const updateConsent = createConsentStateUpdater(setConsent);

  useEffect(() => {
    return subscribeToComplianz(setConsent);
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
    [consent, updateConsent]
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
