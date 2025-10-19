/**
 * TPW (Third-Party Widget) API Service
 *
 * Handles integration with external booking and calendar widgets
 * Provides real-time availability and booking functionality
 */

const TPW_API_BASE = import.meta.env.VITE_TPW_API_URL || 'https://api.tpw-widgets.com/v1';
const TPW_API_KEY = import.meta.env.VITE_TPW_API_KEY || '';

/**
 * Generic TPW API request
 */
async function tpwRequest(endpoint, options = {}) {
  const url = `${TPW_API_BASE}${endpoint}`;

  const config = {
    headers: {
      'Authorization': `Bearer ${TPW_API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `TPW API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('TPW API Error:', error);
    throw error;
  }
}

/**
 * Load TPW booking widget script
 * @param {string} widgetId - Widget identifier
 * @returns {Promise<void>}
 */
export async function loadTPWWidget(widgetId) {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (document.getElementById('tpw-widget-script')) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = 'tpw-widget-script';
    script.src = `https://widgets.tpw.com/embed.js`;
    script.async = true;

    script.onload = () => {
      // Initialize widget
      if (window.TPWWidget) {
        window.TPWWidget.init({
          widgetId: widgetId,
          apiKey: TPW_API_KEY,
        });
      }
      resolve();
    };

    script.onerror = () => reject(new Error('Failed to load TPW widget'));

    document.head.appendChild(script);
  });
}

/**
 * Get availability for specific date range
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} - Available time slots
 */
export async function getAvailability({ startDate, endDate, eventType }) {
  return tpwRequest('/availability', {
    method: 'POST',
    body: JSON.stringify({
      start_date: startDate,
      end_date: endDate,
      event_type: eventType,
    }),
  });
}

/**
 * Create booking request
 * @param {Object} bookingData - Booking details
 * @returns {Promise<Object>} - Booking confirmation
 */
export async function createBooking(bookingData) {
  return tpwRequest('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  });
}

/**
 * Get widget configuration
 * @param {string} widgetType - Type of widget (calendar, booking, reviews)
 * @returns {Object} - Widget configuration
 */
export function getWidgetConfig(widgetType = 'booking') {
  const configs = {
    booking: {
      id: 'mr-dj-booking-widget',
      type: 'booking',
      primaryColor: '#00AEEF',
      language: 'nl',
      currency: 'EUR',
      features: {
        calendar: true,
        timeSlots: true,
        packageSelection: true,
        addons: true,
        payment: false, // Handle separately
      },
    },
    calendar: {
      id: 'mr-dj-calendar-widget',
      type: 'calendar',
      viewMode: 'month',
      showLegend: true,
      highlightToday: true,
    },
    reviews: {
      id: 'mr-dj-reviews-widget',
      type: 'reviews',
      maxReviews: 10,
      showRating: true,
      showDate: true,
      allowSubmit: true,
    },
  };

  return configs[widgetType] || configs.booking;
}

/**
 * Initialize TPW widget in a container
 * @param {string} containerId - Container element ID
 * @param {string} widgetType - Widget type
 * @returns {Promise<void>}
 */
export async function initializeWidget(containerId, widgetType = 'booking') {
  const config = getWidgetConfig(widgetType);

  try {
    await loadTPWWidget(config.id);

    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container ${containerId} not found`);
    }

    // Render widget
    if (window.TPWWidget && window.TPWWidget.render) {
      window.TPWWidget.render(containerId, config);
    }
  } catch (error) {
    console.error('Failed to initialize TPW widget:', error);
    throw error;
  }
}

/**
 * Cleanup widget
 * @param {string} containerId - Container element ID
 */
export function destroyWidget(containerId) {
  if (window.TPWWidget && window.TPWWidget.destroy) {
    window.TPWWidget.destroy(containerId);
  }
}

/**
 * Get booking widget embed code
 * @returns {string} - HTML embed code
 */
export function getBookingWidgetEmbed() {
  const config = getWidgetConfig('booking');

  return `
    <div
      id="${config.id}"
      data-tpw-widget="booking"
      data-tpw-api-key="${TPW_API_KEY}"
      data-tpw-primary-color="${config.primaryColor}"
      data-tpw-language="${config.language}"
      data-tpw-currency="${config.currency}"
      style="width: 100%; min-height: 500px;"
    ></div>
    <script src="https://widgets.tpw.com/embed.js" async></script>
  `;
}

export default {
  loadTPWWidget,
  getAvailability,
  createBooking,
  getWidgetConfig,
  initializeWidget,
  destroyWidget,
  getBookingWidgetEmbed,
};
