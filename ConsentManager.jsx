import React, { createContext, useContext, useState, useEffect } from 'react';

const defaultConsent = {
  functional: false,
  statistics: false,
  marketing: false,
};

// 1. Create the Context
const ConsentContext = createContext(null);

const getComplianzPreferences = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const preferences = window?.complianz?.user_preferences;
  if (!preferences) {
    return null;
  }

  return {
    functional: preferences.functional === 'allow',
    statistics: preferences.statistics === 'allow',
    marketing: preferences.marketing === 'allow',
  };
};

// Helper function to get the current consent status from Complianz
const getConsentStatus = () => getComplianzPreferences() ?? defaultConsent;

// 2. Create the Provider Component
export const ConsentManager = ({ children }) => {
  const [consent, setConsent] = useState(getConsentStatus);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    // Function to update the state when Complianz fires an event
    const handleConsentChange = () => {
      setConsent(getConsentStatus());
    };

    // Complianz fires a custom event when consent is set or changed
    window.addEventListener('cmplz_fire_categories', handleConsentChange);

    // Initial check in case the banner is already dismissed
    handleConsentChange();

    return () => {
      window.removeEventListener('cmplz_fire_categories', handleConsentChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const { marketing, statistics } = consent;

    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        ad_storage: marketing ? 'granted' : 'denied',
        analytics_storage: statistics ? 'granted' : 'denied',
        ad_user_data: marketing ? 'granted' : 'denied',
        ad_personalization: marketing ? 'granted' : 'denied',
      });
      return;
    }

    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: 'consent_update',
        ad_storage: marketing ? 'granted' : 'denied',
        analytics_storage: statistics ? 'granted' : 'denied',
        ad_user_data: marketing ? 'granted' : 'denied',
        ad_personalization: marketing ? 'granted' : 'denied',
      });
    }
  }, [consent]);

  // The value provided to consumers
  const value = {
    ...consent,
    // Helper to check if a specific category is allowed
    isAllowed: (category) => Boolean(consent?.[category]),
  };

  return (
    <ConsentContext.Provider value={value}>
      {children}
    </ConsentContext.Provider>
  );
};

// 3. Create a custom hook for easy consumption
export const useConsent = () => {
  const context = useContext(ConsentContext);
  if (context === undefined || context === null) {
    throw new Error('useConsent must be used within a ConsentManager');
  }
  return context;
};
