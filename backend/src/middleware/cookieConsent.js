/**
 * Cookie consent middleware
 * Logs en valideert cookie toestemmingen
 */

function validateCookieConsent(req, res, next) {
  const consent = req.cookies.cookieConsent;

  // Allow requests without consent check for essential endpoints
  const essentialPaths = ['/health', '/api/contact', '/privacy-policy'];
  if (essentialPaths.some(path => req.path.startsWith(path))) {
    return next();
  }

  // Track consent status
  req.hasAnalyticsConsent = false;
  req.hasMarketingConsent = false;

  if (consent) {
    try {
      const consentData = JSON.parse(consent);
      req.hasAnalyticsConsent = consentData.analytics === true;
      req.hasMarketingConsent = consentData.marketing === true;
    } catch (e) {
      console.error('Invalid cookie consent data:', e);
    }
  }

  next();
}

module.exports = { validateCookieConsent };
