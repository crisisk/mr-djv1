/**
 * A/B Testing Utility
 *
 * Provides automatic 50/50 traffic splitting with cookie persistence
 * for consistent variant assignment across page visits.
 *
 * Features:
 * - Automatic variant assignment (50/50 split)
 * - Cookie persistence for 30 days
 * - Manual override via URL parameter (?variant=B)
 * - Consistent experience across all pages
 */

/**
 * Get a cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
export const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }

  return null;
};

/**
 * Set a cookie with name, value, and expiration
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Number of days until expiration
 */
export const setCookie = (name, value, days) => {
  let expires = "";

  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }

  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

/**
 * Get or assign A/B test variant
 *
 * Logic:
 * 1. Check URL parameter (?variant=B) - if present, use it and store in cookie
 * 2. Check cookie - if present, use stored variant
 * 3. Assign random variant (50/50 split) and store in cookie
 *
 * @returns {string} 'A' or 'B'
 */
export const getOrAssignVariant = () => {
  const COOKIE_NAME = 'mr_dj_ab_variant';
  const COOKIE_DAYS = 30;

  // Check URL parameter first (manual override)
  const urlParams = new URLSearchParams(window.location.search);
  const urlVariant = urlParams.get('variant');

  if (urlVariant === 'B' || urlVariant === 'A') {
    // URL parameter takes precedence - store in cookie
    setCookie(COOKIE_NAME, urlVariant, COOKIE_DAYS);
    return urlVariant;
  }

  // Check existing cookie
  const cookieVariant = getCookie(COOKIE_NAME);

  if (cookieVariant === 'A' || cookieVariant === 'B') {
    // Valid cookie exists - use it
    return cookieVariant;
  }

  // No valid variant found - assign randomly (50/50 split)
  const randomVariant = Math.random() < 0.5 ? 'A' : 'B';
  setCookie(COOKIE_NAME, randomVariant, COOKIE_DAYS);

  return randomVariant;
};

/**
 * Push variant assignment to GTM dataLayer
 * @param {string} variant - The assigned variant ('A' or 'B')
 */
export const pushVariantToGTM = (variant) => {
  // Initialize dataLayer if it doesn't exist
  window.dataLayer = window.dataLayer || [];

  // Push ab_test_assigned event
  window.dataLayer.push({
    event: 'ab_test_assigned',
    variant: variant,
    ab_test_name: 'contact_form_optimization',
    timestamp: new Date().toISOString()
  });

  console.log(`A/B Test Variant Assigned: ${variant} (pushed to GTM dataLayer)`);
};
