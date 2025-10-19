import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the Context
const ConsentContext = createContext(null);

// Helper function to get the current consent status from Complianz
const getConsentStatus = () => {
  if (typeof window === 'undefined' || typeof window.complianz === 'undefined') {
    return {
      functional: false,
      statistics: false,
      marketing: false,
    };
  }
  return {
    functional: window.complianz.user_preferences.functional === 'allow',
    statistics: window.complianz.user_preferences.statistics === 'allow',
    marketing: window.complianz.user_preferences.marketing === 'allow',
  };
};

// 2. Create the Provider Component
export const ConsentManager = ({ children }) => {
  const [consent, setConsent] = useState(() => getConsentStatus());

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
    if (typeof window === 'undefined' || typeof window.dataLayer === 'undefined') {
      return;
    }

    window.dataLayer.push('consent', 'update', {
      ad_storage: consent.marketing ? 'granted' : 'denied',
      analytics_storage: consent.statistics ? 'granted' : 'denied',
      ad_user_data: consent.marketing ? 'granted' : 'denied',
      ad_personalization: consent.marketing ? 'granted' : 'denied',
    });
  }, [consent]);

  // The value provided to consumers
  const value = {
    ...consent,
    // Helper to check if a specific category is allowed
    isAllowed: (category) => consent[category] || false,
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
  if (context === undefined) {
    throw new Error('useConsent must be used within a ConsentManager');
  }
  return context;
};
