/**
 * API Client Service
 *
 * Centralized API communication layer for Mr. DJ website
 * Handles all backend API calls with error handling and CORS
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    let rawBody = '';
    let data = null;

    if (response.status !== 204) {
      rawBody = await response.text();

      if (rawBody) {
        try {
          data = JSON.parse(rawBody);
        } catch {
          data = rawBody;
        }
      }
    }

    // Check for HTTP errors
    if (!response.ok) {
      const message =
        data && typeof data === 'object'
          ? data.message || data.error
          : rawBody || `HTTP Error: ${response.status}`;

      throw new Error(message || `HTTP Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    // Network errors or JSON parse errors
    if (error instanceof TypeError) {
      throw new Error('Netwerkfout: Kan geen verbinding maken met de server');
    }
    if (error instanceof SyntaxError) {
      throw new Error('Server antwoordde met ongeldige data');
    }
    throw error;
  }
}

/**
 * Submit contact form
 * @param {Object} formData - Contact form data
 * @param {string} formData.name - Naam
 * @param {string} formData.email - Email address
 * @param {string} formData.phone - Telefoonnummer
 * @param {string} formData.message - Bericht
 * @param {string} formData.eventType - Type evenement (bruiloft, bedrijfsfeest, etc.)
 * @param {string} formData.eventDate - Gewenste datum (YYYY-MM-DD)
 * @returns {Promise<Object>} API response
 */
export async function submitContactForm(formData) {
  return fetchAPI('/contact', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
}

/**
 * Submit quick callback request
 * @param {Object} formData - Callback form data
 * @returns {Promise<Object>} API response
 */
export async function submitCallbackRequest(formData) {
  return fetchAPI('/callback-request', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
}

/**
 * Get all packages
 * @returns {Promise<Array>} Array of package objects
 */
export async function getPackages() {
  const response = await fetchAPI('/packages');
  return response.packages;
}

/**
 * Check API health
 * @returns {Promise<Object>} Health status
 */
export async function checkHealth() {
  return fetchAPI('/health');
}

/**
 * Submit booking request
 * @param {Object} bookingData - Booking request data
 * @returns {Promise<Object>} API response
 */
export async function submitBooking(bookingData) {
  return fetchAPI('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  });
}

export default {
  submitContactForm,
  submitCallbackRequest,
  getPackages,
  checkHealth,
  submitBooking,
};
