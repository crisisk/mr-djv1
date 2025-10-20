import React, { createContext, useContext, useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'mr-dj-consent-preferences';

const defaultConsent = {
  functional: true,
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

const getStoredPreferences = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storedValue = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!storedValue) {
      return null;
    }

    const parsed = JSON.parse(storedValue);
    return {
      functional: true,
      statistics: Boolean(parsed?.statistics),
      marketing: Boolean(parsed?.marketing),
    };
  } catch (error) {
    console.warn('Unable to read stored consent preferences', error);
    return null;
  }
};

const shouldDisplayBanner = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  if (getComplianzPreferences()) {
    return false;
  }

  return !getStoredPreferences();
};

// Helper function to get the current consent status from Complianz
const getConsentStatus = () => getComplianzPreferences() ?? getStoredPreferences() ?? defaultConsent;

// 2. Create the Provider Component
export const ConsentManager = ({ children }) => {
  const [consent, setConsent] = useState(getConsentStatus);
  const [isBannerVisible, setIsBannerVisible] = useState(shouldDisplayBanner);
  const [pendingConsent, setPendingConsent] = useState(() => ({
    statistics: Boolean(consent.statistics),
    marketing: Boolean(consent.marketing),
  }));

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    // Function to update the state when Complianz fires an event
    const handleConsentChange = () => {
      const complianzConsent = getComplianzPreferences();
      const storedConsent = complianzConsent ? null : getStoredPreferences();
      const updatedConsent = complianzConsent ?? storedConsent ?? defaultConsent;
      const hasExistingConsent = Boolean(complianzConsent ?? storedConsent);

      setConsent(updatedConsent);
      if (hasExistingConsent) {
        setIsBannerVisible(false);
      }
      setPendingConsent({
        statistics: Boolean(updatedConsent.statistics),
        marketing: Boolean(updatedConsent.marketing),
      });
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
    setPendingConsent((current) => {
      const next = {
        statistics: Boolean(consent.statistics),
        marketing: Boolean(consent.marketing),
      };

      if (current.statistics === next.statistics && current.marketing === next.marketing) {
        return current;
      }

      return next;
    });
  }, [consent.statistics, consent.marketing]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          statistics: Boolean(consent.statistics),
          marketing: Boolean(consent.marketing),
          updatedAt: new Date().toISOString(),
        }),
      );
    } catch (error) {
      console.warn('Unable to persist consent preferences', error);
    }
  }, [consent]);

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

  const closeBanner = () => {
    setIsBannerVisible(false);
  };

  const handleAcceptAll = () => {
    setConsent((previous) => ({
      ...previous,
      statistics: true,
      marketing: true,
    }));
    closeBanner();
  };

  const handleDeclineNonEssential = () => {
    setConsent((previous) => ({
      ...previous,
      statistics: false,
      marketing: false,
    }));
    setPendingConsent({ statistics: false, marketing: false });
    closeBanner();
  };

  const handleSavePreferences = () => {
    setConsent((previous) => ({
      ...previous,
      statistics: Boolean(pendingConsent.statistics),
      marketing: Boolean(pendingConsent.marketing),
    }));
    closeBanner();
  };

  const togglePreference = (category) => (event) => {
    const { checked } = event.target;
    setPendingConsent((current) => ({
      ...current,
      [category]: checked,
    }));
  };

  // The value provided to consumers
  const value = {
    ...consent,
    // Helper to check if a specific category is allowed
    isAllowed: (category) => Boolean(consent?.[category]),
    openPreferences: () => setIsBannerVisible(true),
  };

  return (
    <ConsentContext.Provider value={value}>
      {isBannerVisible && (
        <section
          className="consent-banner"
          role="dialog"
          aria-modal="true"
          aria-labelledby="consent-banner-heading"
          aria-describedby="consent-banner-description"
        >
          <div className="consent-banner__content">
            <h2 id="consent-banner-heading" className="consent-banner__heading">
              Cookie preferences
            </h2>
            <p id="consent-banner-description" className="consent-banner__description">
              We use cookies to deliver the best online experience. Some cookies are essential for our site to function, while
              others help us improve services and deliver personalized marketing. Under GDPR, we only load non-essential
              cookies after you opt in. You can update or withdraw your consent at any time by reopening these preferences.
            </p>
            <ul className="consent-banner__list">
              <li>
                <strong>Essential cookies</strong> – Required for security and core features such as remembering your session.
              </li>
              <li>
                <label className="consent-banner__option">
                  <div>
                    <strong>Analytics cookies</strong> – Help us understand how visitors use the site so we can improve it.
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(pendingConsent.statistics)}
                    onChange={togglePreference('statistics')}
                    aria-label="Toggle analytics cookies"
                  />
                </label>
              </li>
              <li>
                <label className="consent-banner__option">
                  <div>
                    <strong>Marketing cookies</strong> – Enable personalized offers and measure campaign performance.
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(pendingConsent.marketing)}
                    onChange={togglePreference('marketing')}
                    aria-label="Toggle marketing cookies"
                  />
                </label>
              </li>
            </ul>
            <p className="consent-banner__choices">
              By choosing “Accept all”, you agree to the use of all cookies described above. Selecting “Decline non-essential”
              allows us to store only essential cookies. Use “Save preferences” to fine-tune your consent by category. You can
              revisit this banner at any time through the “Cookie settings” link in the footer.
            </p>
            <div className="consent-banner__actions">
              <button type="button" className="button button--ghost" onClick={handleDeclineNonEssential}>
                Decline non-essential
              </button>
              <button type="button" className="button button--secondary" onClick={handleSavePreferences}>
                Save preferences
              </button>
              <button type="button" className="button button--primary" onClick={handleAcceptAll}>
                Accept all
              </button>
            </div>
          </div>
        </section>
      )}
      {!isBannerVisible && (
        <button type="button" className="button button--ghost consent-banner__settings" onClick={() => setIsBannerVisible(true)}>
          Cookie settings
        </button>
      )}
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
