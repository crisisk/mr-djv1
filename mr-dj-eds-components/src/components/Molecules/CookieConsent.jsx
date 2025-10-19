import React, { useState, useEffect } from 'react';
import Button from '../Atoms/Buttons.jsx';

/**
 * CookieConsent Component
 * GDPR-compliant cookie consent banner
 *
 * Features:
 * - Shows consent banner on first visit
 * - Stores consent in localStorage
 * - Updates Google Consent Mode v2
 * - Allows accept/decline cookies
 */
const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem('cookieConsent');

    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      // If consent was previously given, update consent mode
      updateConsentMode(consent === 'accepted');
    }
  }, []);

  const updateConsentMode = (granted) => {
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'ad_storage': granted ? 'granted' : 'denied',
        'analytics_storage': granted ? 'granted' : 'denied',
        'ad_user_data': granted ? 'granted' : 'denied',
        'ad_personalization': granted ? 'granted' : 'denied',
      });

      // Track consent decision in GTM
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'cookie_consent_update',
        consent_granted: granted
      });
    }
  };

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    updateConsentMode(true);
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    updateConsentMode(false);
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-[#1A2C4B] text-white p-6 shadow-2xl z-50 border-t-4 border-primary"
      role="dialog"
      aria-label="Cookie consent"
      aria-describedby="cookie-consent-description"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Text content */}
          <div className="flex-1">
            <h3 className="text-font-size-h4 font-bold mb-2 text-secondary">
              Deze website gebruikt cookies
            </h3>
            <p id="cookie-consent-description" className="text-base text-white opacity-90">
              Wij gebruiken cookies om uw ervaring te verbeteren en om onze website te analyseren.
              Door op "Accepteren" te klikken, gaat u akkoord met het gebruik van alle cookies.
              U kunt ook kiezen om cookies te weigeren.
              {' '}
              <a
                href="/privacy-policy"
                className="underline hover:text-secondary transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                Lees meer in ons privacybeleid
              </a>
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 flex-shrink-0">
            <Button
              variant="ghost"
              size="medium"
              onClick={handleDecline}
              className="border border-neutral-light text-white hover:bg-white hover:text-[#1A2C4B]"
            >
              Weigeren
            </Button>
            <Button
              variant="primary"
              size="medium"
              onClick={handleAccept}
              className="bg-secondary hover:bg-secondary/90"
            >
              Accepteren
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
