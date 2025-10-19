/**
 * GA4 Conversion Tracking Utility
 *
 * This module provides functions to track various conversion events for the Mr. DJ website.
 * All events are pushed to the dataLayer for GTM/GA4 processing.
 *
 * GTM Container: GTM-NST23HJX
 * Google Analytics: info@mr-dj.nl
 */

/**
 * Base function to push conversion events to dataLayer
 * @param {Object} eventData - Event data to push
 */
const pushToDataLayer = (eventData) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(eventData);
    console.log('GA4 Conversion Tracked:', eventData);
  } else {
    console.warn('dataLayer not found - event not tracked:', eventData);
  }
};

/**
 * Track form submission conversion
 * @param {string} variant - A/B test variant ('A' or 'B')
 * @param {string} eventType - Type of event (e.g., 'bruiloft', 'bedrijfsfeest')
 * @param {string} formType - Type of form ('contact', 'quote', 'availability')
 */
export const trackFormSubmission = (variant = 'A', eventType = '', formType = 'contact') => {
  pushToDataLayer({
    event: 'conversion',
    conversion_type: 'form_submit',
    form_type: formType,
    variant: variant,
    event_type: eventType,
    value: 1,
    currency: 'EUR',
    timestamp: new Date().toISOString()
  });
};

/**
 * Track phone click conversion
 * @param {string} variant - A/B test variant ('A' or 'B')
 * @param {string} location - Where the phone click occurred (e.g., 'header', 'footer', 'contact_page')
 */
export const trackPhoneClick = (variant = 'A', location = 'unknown') => {
  pushToDataLayer({
    event: 'conversion',
    conversion_type: 'phone_click',
    variant: variant,
    click_location: location,
    value: 1,
    currency: 'EUR',
    timestamp: new Date().toISOString()
  });
};

/**
 * Track quote request conversion
 * @param {string} variant - A/B test variant ('A' or 'B')
 * @param {string} eventType - Type of event requesting quote for
 */
export const trackQuoteRequest = (variant = 'A', eventType = '') => {
  pushToDataLayer({
    event: 'conversion',
    conversion_type: 'quote_request',
    variant: variant,
    event_type: eventType,
    value: 1,
    currency: 'EUR',
    timestamp: new Date().toISOString()
  });
};

/**
 * Track availability check conversion
 * @param {string} variant - A/B test variant ('A' or 'B')
 * @param {string} selectedDate - The date selected by user
 */
export const trackAvailabilityCheck = (variant = 'A', selectedDate = '') => {
  pushToDataLayer({
    event: 'conversion',
    conversion_type: 'availability_check',
    variant: variant,
    selected_date: selectedDate,
    value: 1,
    currency: 'EUR',
    timestamp: new Date().toISOString()
  });
};

/**
 * Track pricing table CTA click conversion
 * @param {string} variant - A/B test variant ('A' or 'B')
 * @param {string} packageName - Package name (e.g., 'brons', 'zilver', 'goud')
 * @param {string} packagePrice - Package price
 */
export const trackPricingCTA = (variant = 'A', packageName = '', packagePrice = '') => {
  pushToDataLayer({
    event: 'conversion',
    conversion_type: 'pricing_cta',
    variant: variant,
    package_name: packageName.toLowerCase(),
    package_price: packagePrice,
    value: 1,
    currency: 'EUR',
    timestamp: new Date().toISOString()
  });
};

/**
 * Track navigation to contact page
 * @param {string} variant - A/B test variant ('A' or 'B')
 * @param {string} source - Where the navigation originated from
 */
export const trackContactNavigation = (variant = 'A', source = 'unknown') => {
  pushToDataLayer({
    event: 'conversion',
    conversion_type: 'contact_navigation',
    variant: variant,
    navigation_source: source,
    value: 1,
    currency: 'EUR',
    timestamp: new Date().toISOString()
  });
};

/**
 * Track general button click (for additional tracking needs)
 * @param {string} variant - A/B test variant ('A' or 'B')
 * @param {string} buttonText - Text of the button clicked
 * @param {string} buttonLocation - Location of the button on the page
 */
export const trackButtonClick = (variant = 'A', buttonText = '', buttonLocation = '') => {
  pushToDataLayer({
    event: 'button_click',
    variant: variant,
    button_text: buttonText,
    button_location: buttonLocation,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track WhatsApp chat initiation
 * @param {string} variant - A/B test variant ('A' or 'B')
 */
export const trackWhatsAppClick = (variant = 'A') => {
  pushToDataLayer({
    event: 'conversion',
    conversion_type: 'whatsapp_click',
    variant: variant,
    value: 1,
    currency: 'EUR',
    timestamp: new Date().toISOString()
  });
};

/**
 * Initialize or update user variant for A/B testing
 * @param {string} variant - The variant to set ('A' or 'B')
 */
export const setUserVariant = (variant) => {
  if (typeof window !== 'undefined') {
    // Store variant in sessionStorage for consistency during session
    sessionStorage.setItem('ab_variant', variant);

    // Push to dataLayer
    pushToDataLayer({
      event: 'ab_variant_set',
      variant: variant,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Get current user variant
 * @returns {string} Current variant ('A' or 'B')
 */
export const getUserVariant = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('ab_variant') || 'A';
  }
  return 'A';
};

// Export all tracking functions as default object
export default {
  trackFormSubmission,
  trackPhoneClick,
  trackQuoteRequest,
  trackAvailabilityCheck,
  trackPricingCTA,
  trackContactNavigation,
  trackButtonClick,
  trackWhatsAppClick,
  setUserVariant,
  getUserVariant
};
