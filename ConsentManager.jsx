import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

const LOCAL_STORAGE_KEY = "mr-dj-consent-preferences";

const defaultConsent = {
  functional: true,
  statistics: false,
  marketing: false,
};

const FACEBOOK_PIXEL_SCRIPT_ID = "mr-dj-facebook-pixel-script";
const FACEBOOK_PIXEL_NOSCRIPT_ID = "mr-dj-facebook-pixel-noscript";
const MARKETING_CONSENT_EVENT = "mr-dj:marketing-consent-change";
const GTM_SCRIPT_ID = "mr-dj-gtm-script";
const GTM_IFRAME_ID = "mr-dj-gtm-noscript";
const DATA_LAYER_NAME = "dataLayer";

const marketingConsentSubscribers = new Set();

const getMetaContent = (name) => {
  if (typeof document === "undefined") {
    return null;
  }

  const meta = document.querySelector(`meta[name="${name}"]`);
  if (meta?.content?.trim()) {
    return meta.content.trim();
  }

  return null;
};

const getGtmId = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const fromWindow =
    window.__MR_DJ_GTM_ID || window.GTM_ID || window.dataLayerGtmId || null;

  if (typeof fromWindow === "string" && fromWindow.trim()) {
    return fromWindow.trim();
  }

  const fromMeta = getMetaContent("gtm-container-id");
  if (fromMeta) {
    return fromMeta;
  }

  if (typeof document !== "undefined") {
    const attribute = document.documentElement?.getAttribute("data-gtm-id");
    if (attribute?.trim()) {
      return attribute.trim();
    }
  }

  return null;
};

const ensureDataLayer = () => {
  if (typeof window === "undefined") {
    return [];
  }

  if (!Array.isArray(window[DATA_LAYER_NAME])) {
    window[DATA_LAYER_NAME] = [];
  }

  return window[DATA_LAYER_NAME];
};

const removeGtmNodes = () => {
  if (typeof document === "undefined") {
    return;
  }

  const script = document.getElementById(GTM_SCRIPT_ID);
  if (script?.parentNode) {
    script.parentNode.removeChild(script);
  }

  const iframe = document.getElementById(GTM_IFRAME_ID);
  if (iframe?.parentNode) {
    iframe.parentNode.removeChild(iframe);
  }
};

const injectGtm = () => {
  if (typeof document === "undefined") {
    return;
  }

  const gtmId = getGtmId();
  if (!gtmId) {
    console.warn("GTM container ID is niet geconfigureerd. Sla GTM-injectie over.");
    return;
  }

  const dataLayer = ensureDataLayer();

  if (!document.getElementById(GTM_SCRIPT_ID)) {
    dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    const script = document.createElement("script");
    script.id = GTM_SCRIPT_ID;
    const dataLayerParam = DATA_LAYER_NAME === "dataLayer" ? "" : `&l=${DATA_LAYER_NAME}`;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}${dataLayerParam}`;
    script.async = true;
    if (document.head) {
      document.head.appendChild(script);
    } else {
      document.documentElement?.appendChild(script);
    }
  }

  if (!document.getElementById(GTM_IFRAME_ID)) {
    const iframe = document.createElement("noscript");
    iframe.id = GTM_IFRAME_ID;
    iframe.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(
      gtmId,
    )}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    if (document.body) {
      document.body.appendChild(iframe);
    } else {
      document.documentElement?.appendChild(iframe);
    }
  }
};

const updateGtmContainer = (shouldLoad) => {
  if (shouldLoad) {
    injectGtm();
    return;
  }

  removeGtmNodes();
};

const getFacebookPixelId = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const fromWindow =
    window.MR_DJ_FACEBOOK_PIXEL_ID ||
    window.__MR_DJ_FACEBOOK_PIXEL_ID ||
    window.facebookPixelId ||
    null;

  if (typeof fromWindow === "string" && fromWindow.trim()) {
    return fromWindow.trim();
  }

  const meta = document.querySelector('meta[name="facebook-pixel-id"]');
  if (meta?.content?.trim()) {
    return meta.content.trim();
  }

  return null;
};

const removeFacebookPixelNodes = () => {
  if (typeof document === "undefined") {
    return;
  }

  const script = document.getElementById(FACEBOOK_PIXEL_SCRIPT_ID);
  if (script?.parentNode) {
    script.parentNode.removeChild(script);
  }

  const noscript = document.getElementById(FACEBOOK_PIXEL_NOSCRIPT_ID);
  if (noscript?.parentNode) {
    noscript.parentNode.removeChild(noscript);
  }
};

const injectFacebookPixel = () => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  const pixelId = getFacebookPixelId();
  if (!pixelId) {
    console.warn("Facebook Pixel ID is not configured. Skipping pixel injection.");
    return;
  }

  if (!document.getElementById(FACEBOOK_PIXEL_SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = FACEBOOK_PIXEL_SCRIPT_ID;
    script.setAttribute("data-testid", FACEBOOK_PIXEL_SCRIPT_ID);
    script.innerHTML =
      "!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?" +
      "n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;" +
      "n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;" +
      "t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(" +
      "window,document,'script','https://connect.facebook.net/en_US/fbevents.js');" +
      `fbq('init','${pixelId}');fbq('track','PageView');`;
    if (document.head) {
      document.head.appendChild(script);
    } else {
      document.documentElement?.appendChild(script);
    }
  }

  if (!document.getElementById(FACEBOOK_PIXEL_NOSCRIPT_ID)) {
    const noscript = document.createElement("noscript");
    noscript.id = FACEBOOK_PIXEL_NOSCRIPT_ID;
    noscript.setAttribute("data-testid", FACEBOOK_PIXEL_NOSCRIPT_ID);
    noscript.innerHTML = `<img height="1" width="1" style="display:none" alt="" src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" />`;
    if (document.body) {
      document.body.appendChild(noscript);
    } else {
      document.documentElement?.appendChild(noscript);
    }
  }

  if (typeof window.fbq === "function") {
    window.fbq("consent", "grant");
  }
};

const disableFacebookPixel = () => {
  if (typeof window === "undefined") {
    return;
  }

  if (typeof window.fbq === "function") {
    try {
      window.fbq("consent", "revoke");
    } catch (error) {
      console.warn("Unable to notify Facebook Pixel about revoked consent", error);
    }
  }

  removeFacebookPixelNodes();
};

const updateFacebookPixelConsent = (isGranted) => {
  if (isGranted) {
    injectFacebookPixel();
    return;
  }

  disableFacebookPixel();
};

const notifyMarketingConsentChange = (isGranted) => {
  const subscribers = Array.from(marketingConsentSubscribers);

  subscribers.forEach((callback) => {
    try {
      callback(isGranted);
    } catch (error) {
      console.error("Marketing consent subscriber threw an error", error);
    }
  });

  if (
    typeof window !== "undefined" &&
    typeof window.dispatchEvent === "function" &&
    typeof window.CustomEvent === "function"
  ) {
    window.dispatchEvent(
      new window.CustomEvent(MARKETING_CONSENT_EVENT, { detail: { granted: isGranted } }),
    );
  }
};

// 1. Create the Context
const ConsentContext = createContext(null);

const getComplianzPreferences = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const preferences = window?.complianz?.user_preferences;
  if (!preferences) {
    return null;
  }

  return {
    functional: preferences.functional === "allow",
    statistics: preferences.statistics === "allow",
    marketing: preferences.marketing === "allow",
  };
};

const getStoredPreferences = () => {
  if (typeof window === "undefined") {
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
    console.warn("Unable to read stored consent preferences", error);
    return null;
  }
};

const shouldDisplayBanner = () => {
  if (typeof window === "undefined") {
    return false;
  }

  if (getComplianzPreferences()) {
    return false;
  }

  return !getStoredPreferences();
};

// Helper function to get the current consent status from Complianz
const getConsentStatus = () =>
  getComplianzPreferences() ?? getStoredPreferences() ?? defaultConsent;

// 2. Create the Provider Component
export const ConsentManager = ({ children }) => {
  const [consent, setConsent] = useState(getConsentStatus);
  const [isBannerVisible, setIsBannerVisible] = useState(shouldDisplayBanner);
  const [pendingConsent, setPendingConsent] = useState(() => ({
    statistics: Boolean(consent.statistics),
    marketing: Boolean(consent.marketing),
  }));
  const lastMarketingConsentRef = useRef();

  useEffect(
    () => () => {
      marketingConsentSubscribers.clear();
    },
    [],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const isGranted = Boolean(consent.marketing);

    if (lastMarketingConsentRef.current === isGranted) {
      return undefined;
    }

    lastMarketingConsentRef.current = isGranted;
    updateFacebookPixelConsent(isGranted);
    notifyMarketingConsentChange(isGranted);

    return undefined;
  }, [consent.marketing]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    updateGtmContainer(Boolean(consent.statistics || consent.marketing));
  }, [consent.statistics, consent.marketing]);

  useEffect(() => {
    if (typeof window === "undefined") {
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
    window.addEventListener("cmplz_fire_categories", handleConsentChange);

    // Initial check in case the banner is already dismissed
    handleConsentChange();

    return () => {
      window.removeEventListener("cmplz_fire_categories", handleConsentChange);
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
    if (typeof window === "undefined") {
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
      console.warn("Unable to persist consent preferences", error);
    }
  }, [consent]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const { marketing, statistics } = consent;

    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        ad_storage: marketing ? "granted" : "denied",
        analytics_storage: statistics ? "granted" : "denied",
        ad_user_data: marketing ? "granted" : "denied",
        ad_personalization: marketing ? "granted" : "denied",
      });
      return;
    }

    const dataLayer = ensureDataLayer();
    dataLayer.push({
      event: "consent_update",
      ad_storage: marketing ? "granted" : "denied",
      analytics_storage: statistics ? "granted" : "denied",
      ad_user_data: marketing ? "granted" : "denied",
      ad_personalization: marketing ? "granted" : "denied",
    });
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
  const subscribeToMarketingConsent = useCallback(
    (callback) => {
      if (typeof callback !== "function") {
        return () => {};
      }

      marketingConsentSubscribers.add(callback);

      try {
        callback(Boolean(consent.marketing));
      } catch (error) {
        console.error("Marketing consent subscriber threw an error", error);
      }

      return () => {
        marketingConsentSubscribers.delete(callback);
      };
    },
    [consent.marketing],
  );

  const value = {
    ...consent,
    // Helper to check if a specific category is allowed
    isAllowed: (category) => Boolean(consent?.[category]),
    openPreferences: () => setIsBannerVisible(true),
    subscribeToMarketingConsent,
    marketingConsentEventName: MARKETING_CONSENT_EVENT,
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
              We use cookies to deliver the best online experience. Some cookies are essential for
              our site to function, while others help us improve services and deliver personalized
              marketing. Under GDPR, we only load non-essential cookies after you opt in. You can
              update or withdraw your consent at any time by reopening these preferences.
            </p>
            <ul className="consent-banner__list">
              <li>
                <strong>Essential cookies</strong> – Required for security and core features such as
                remembering your session.
              </li>
              <li>
                <label className="consent-banner__option">
                  <div>
                    <strong>Analytics cookies</strong> – Help us understand how visitors use the
                    site so we can improve it.
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(pendingConsent.statistics)}
                    onChange={togglePreference("statistics")}
                    aria-label="Toggle analytics cookies"
                  />
                </label>
              </li>
              <li>
                <label className="consent-banner__option">
                  <div>
                    <strong>Marketing cookies</strong> – Enable personalized offers and measure
                    campaign performance.
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(pendingConsent.marketing)}
                    onChange={togglePreference("marketing")}
                    aria-label="Toggle marketing cookies"
                  />
                </label>
              </li>
            </ul>
            <p className="consent-banner__choices">
              By choosing “Accept all”, you agree to the use of all cookies described above.
              Selecting “Decline non-essential” allows us to store only essential cookies. Use “Save
              preferences” to fine-tune your consent by category. You can revisit this banner at any
              time through the “Cookie settings” link in the footer.
            </p>
            <div className="consent-banner__actions">
              <button
                type="button"
                className="button button--ghost"
                onClick={handleDeclineNonEssential}
              >
                Decline non-essential
              </button>
              <button
                type="button"
                className="button button--secondary"
                onClick={handleSavePreferences}
              >
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
        <button
          type="button"
          className="button button--ghost consent-banner__settings"
          onClick={() => setIsBannerVisible(true)}
        >
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
    throw new Error("useConsent must be used within a ConsentManager");
  }
  return context;
};

export const MARKETING_CONSENT_EVENT_NAME = MARKETING_CONSENT_EVENT;
