import React, { useState, useEffect, useRef } from 'react';
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
  const bannerRef = useRef(null);
  const declineButtonRef = useRef(null);
  const previouslyFocusedElementRef = useRef(null);

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

  const closeBanner = () => {
    setShowBanner(false);
  };

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    updateConsentMode(true);
    closeBanner();
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    updateConsentMode(false);
    closeBanner();
  };

  useEffect(() => {
    if (showBanner) {
      previouslyFocusedElementRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;

      // Ensure focusable elements render before attempting to focus
      const focusTimeout = setTimeout(() => {
        declineButtonRef.current?.focus();
      }, 0);

      return () => clearTimeout(focusTimeout);
    }

    const previouslyFocused = previouslyFocusedElementRef.current;

    if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
      previouslyFocused.focus();
    }

    previouslyFocusedElementRef.current = null;

    return undefined;
  }, [showBanner]);

  const handleKeyDown = (event) => {
    if (!bannerRef.current) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      handleDecline();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusableSelectors =
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const focusableElements = Array.from(
      bannerRef.current.querySelectorAll(focusableSelectors)
    ).filter(
      (element) => !element.hasAttribute('disabled') && !element.getAttribute('aria-hidden')
    );

    if (focusableElements.length === 0) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const isShiftPressed = event.shiftKey;
    const currentFocus = document.activeElement;

    if (!isShiftPressed && currentFocus === lastElement) {
      event.preventDefault();
      firstElement.focus();
    } else if (isShiftPressed && currentFocus === firstElement) {
      event.preventDefault();
      lastElement.focus();
    }
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
      aria-modal="true"
      tabIndex="-1"
      ref={bannerRef}
      onKeyDown={handleKeyDown}
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
              ref={declineButtonRef}
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
