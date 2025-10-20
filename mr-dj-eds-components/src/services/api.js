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

  const headers = new Headers(options.headers || {});
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    let rawBody = '';
    let data = null;

    let parsedBody = null;
    if (response.status !== 204) {
      const rawBody = await response.text();
      if (rawBody) {
        try {
          parsedBody = JSON.parse(rawBody);
        } catch {
          parsedBody = rawBody;
        }
      }
    }

    if (!response.ok) {
      const message =
        (parsedBody && typeof parsedBody === 'object' && (parsedBody.message || parsedBody.error)) ||
        `HTTP Error: ${response.status}`;
      throw new Error(message);
    }

    return parsedBody;
  } catch (error) {
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
 * @returns {Promise<Object|null>} API response
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
 * @returns {Promise<Object|null>} API response
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
  return response?.packages ?? [];
}

/**
 * Check API health
 * @returns {Promise<Object|null>} Health status
 */
export async function checkHealth() {
  return fetchAPI('/health');
}

/**
 * Submit booking request
 * @param {Object} bookingData - Booking request data
 * @returns {Promise<Object|null>} API response
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
