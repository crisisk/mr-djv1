/**
 * MR-DJ Dynamic Content & Personalization
 * A/B Testing and User Segmentation Integration
 */

(function() {
  'use strict';

  // Configuration
  const API_BASE = '/api/personalize';
  const ANON_ID_COOKIE = 'mrdj_anon_id';
  const SESSION_ID_COOKIE = 'mrdj_session_id';
  const COOKIE_EXPIRY_DAYS = 365;

  // Utility: Get or create cookie
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
  }

  function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Get or create anonymous ID
  function getAnonId() {
    let anonId = getCookie(ANON_ID_COOKIE);
    if (!anonId) {
      anonId = generateId();
      setCookie(ANON_ID_COOKIE, anonId, COOKIE_EXPIRY_DAYS);
    }
    return anonId;
  }

  // Get or create session ID
  function getSessionId() {
    let sessionId = getCookie(SESSION_ID_COOKIE);
    if (!sessionId) {
      sessionId = generateId();
      setCookie(SESSION_ID_COOKIE, sessionId, 1); // Session cookie (1 day)
    }
    return sessionId;
  }

  // Fetch personalized content for a zone
  async function fetchPersonalizedContent(zone) {
    try {
      const response = await fetch(`${API_BASE}?zone=${zone}`, {
        headers: {
          'Accept': 'application/json',
          'X-Anon-ID': getAnonId(),
          'X-Session-ID': getSessionId()
        }
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('[MR-DJ Dynamic] Failed to fetch personalized content:', error);
      return null;
    }
  }

  // Apply variant to hero section
  function applyHeroVariant(variant) {
    if (!variant || !variant.assets) return;

    const hero = document.querySelector('.hero-section, [data-zone="hero"]');
    if (!hero) return;

    // Update headline
    if (variant.assets.headline) {
      const h1 = hero.querySelector('h1');
      if (h1) h1.textContent = variant.assets.headline;
    }

    // Update subline
    if (variant.assets.subline) {
      const subline = hero.querySelector('.hero-subline, .lead, p');
      if (subline) subline.textContent = variant.assets.subline;
    }

    // Update CTA
    if (variant.assets.cta) {
      const cta = hero.querySelector('.cta-button, .btn-primary, a[href*="contact"]');
      if (cta) {
        if (variant.assets.cta.label) cta.textContent = variant.assets.cta.label;
        if (variant.assets.cta.href) cta.href = variant.assets.cta.href;
      }
    }

    // Update background image
    if (variant.assets.img) {
      hero.style.backgroundImage = `url('${variant.assets.img}')`;
    }

    // Store exposure token
    hero.setAttribute('data-exposure-token', variant.assets.exposure_token || '');
  }

  // Log exposure (optional - can be done server-side)
  function logExposure(exposureToken, zone, variant) {
    // Send beacon to track exposure
    if (navigator.sendBeacon) {
      const data = JSON.stringify({
        exposure_token: exposureToken,
        zone: zone,
        variant: variant,
        anon_id: getAnonId(),
        session_id: getSessionId(),
        timestamp: new Date().toISOString()
      });
      navigator.sendBeacon('/api/log-exposure', data);
    }
  }

  // Log outcome (conversion event)
  window.MRDJTracking = window.MRDJTracking || {};
  window.MRDJTracking.logOutcome = function(event, value) {
    const activeExposures = [];

    // Collect all active experiment exposures from page
    document.querySelectorAll('[data-exposure-token]').forEach(el => {
      const token = el.getAttribute('data-exposure-token');
      if (token) activeExposures.push(token);
    });

    const data = {
      event: event,
      value: value || 1,
      anon_id: getAnonId(),
      session_id: getSessionId(),
      page: window.location.pathname,
      exposures: activeExposures,
      timestamp: new Date().toISOString()
    };

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/log-outcome', JSON.stringify(data));
    }
  };

  // Initialize dynamic content on page load
  async function initializeDynamicContent() {
    // Check if hero section exists
    const heroZone = document.querySelector('.hero-section, [data-zone="hero"]');
    if (heroZone) {
      const content = await fetchPersonalizedContent('hero');
      if (content && content.variant) {
        applyHeroVariant(content.variant);

        // Log exposure
        if (content.exposure_token) {
          logExposure(content.exposure_token, 'hero', content.variant.key);
        }
      }
    }

    // Track form submissions
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', function(e) {
        const formType = this.id || this.className || 'unknown';
        window.MRDJTracking.logOutcome(`form_submit_${formType}`, 1);
      });
    });

    // Track CTA clicks
    document.querySelectorAll('.cta-button, .btn-primary, [data-track="cta"]').forEach(btn => {
      btn.addEventListener('click', function(e) {
        const ctaLabel = this.textContent.trim() || 'unknown';
        window.MRDJTracking.logOutcome('cta_click', 1);
      });
    });
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDynamicContent);
  } else {
    initializeDynamicContent();
  }

  // Expose API for advanced usage
  window.MRDJDynamic = {
    fetchContent: fetchPersonalizedContent,
    getAnonId: getAnonId,
    getSessionId: getSessionId,
    logOutcome: window.MRDJTracking.logOutcome
  };

})();
