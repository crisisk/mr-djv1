// GTM Event Tracking for Mr. DJ
// Version: 1.0
// Date: 2025-10-21
// Container ID: GTM-TK95XXK
// GA4 Measurement ID: G-166LYYHW64

(function() {
  'use strict';

  // Initialize dataLayer if not exists
  window.dataLayer = window.dataLayer || [];

  // Helper function to push events
  function pushEvent(eventName, eventParams) {
    window.dataLayer.push({
      event: eventName,
      ...eventParams
    });

    // Debug logging (remove in production if needed)
    if (console && console.log) {
      console.log('GTM Event:', eventName, eventParams);
    }
  }

  // 1. Contact Form Submission Tracking
  function trackContactForm() {
    const contactForms = document.querySelectorAll('form[name="contact"], form#contact-form, form.contact-form');

    contactForms.forEach(form => {
      form.addEventListener('submit', function(e) {
        pushEvent('contact_form_submit', {
          form_id: this.id || 'contact-form',
          form_name: this.name || 'contact',
          page_path: window.location.pathname,
          page_title: document.title,
          value: 100
        });
      });
    });
  }

  // 2. WhatsApp Click Tracking
  function trackWhatsAppClicks() {
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a[href*="wa.me"], a[href*="whatsapp"]');
      if (link) {
        pushEvent('whatsapp_click', {
          link_url: link.href,
          link_text: link.textContent.trim(),
          page_path: window.location.pathname,
          value: 80
        });
      }
    });
  }

  // 3. Phone Click Tracking
  function trackPhoneClicks() {
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a[href^="tel:"]');
      if (link) {
        const phoneNumber = link.href.replace('tel:', '');
        pushEvent('phone_click', {
          phone_number: phoneNumber,
          link_text: link.textContent.trim(),
          page_path: window.location.pathname,
          value: 90
        });
      }
    });
  }

  // 4. Quote Request Button Tracking
  function trackQuoteRequests() {
    const quoteButtons = document.querySelectorAll(
      'a[href*="contact"][class*="cta"], ' +
      'button[class*="quote"], ' +
      'a[href*="#offerte"], ' +
      '.btn-primary, ' +
      '.cta-button'
    );

    quoteButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        // Extract service type from URL or page
        const servicePath = window.location.pathname;
        let serviceType = 'general';

        if (servicePath.includes('bruiloft')) serviceType = 'bruiloft';
        else if (servicePath.includes('bedrijf')) serviceType = 'bedrijf';
        else if (servicePath.includes('prive')) serviceType = 'privé';
        else if (servicePath.includes('dj-sax')) serviceType = 'dj+sax';

        pushEvent('quote_request', {
          service_type: serviceType,
          button_text: this.textContent.trim(),
          page_path: window.location.pathname,
          page_title: document.title,
          value: 120
        });
      });
    });
  }

  // 5. Service Page View Tracking
  function trackServicePageViews() {
    const path = window.location.pathname;

    // Check if this is a service page
    if (path.match(/.*(bruiloft|bedrijf|prive|dj-in-|dj-sax).*/)) {
      let serviceCategory = 'general';
      let serviceName = document.title.split('|')[0].trim();

      if (path.includes('bruiloft')) serviceCategory = 'bruiloft';
      else if (path.includes('bedrijf')) serviceCategory = 'bedrijf';
      else if (path.includes('prive')) serviceCategory = 'privé';
      else if (path.includes('dj-sax')) serviceCategory = 'dj+sax';
      else if (path.includes('dj-in-')) {
        serviceCategory = 'lokaal';
        serviceName = path.match(/dj-in-([^\/]+)/)?.[1] || 'unknown';
      }

      pushEvent('view_service', {
        service_name: serviceName,
        service_category: serviceCategory,
        page_path: path,
        page_title: document.title
      });
    }
  }

  // 6. Scroll Depth Tracking (Custom)
  function trackScrollDepth() {
    let scrollDepthMarks = {
      25: false,
      50: false,
      75: false,
      90: false
    };

    window.addEventListener('scroll', function() {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      Object.keys(scrollDepthMarks).forEach(mark => {
        if (scrollPercent >= parseInt(mark) && !scrollDepthMarks[mark]) {
          scrollDepthMarks[mark] = true;
          pushEvent('scroll_depth', {
            percent_scrolled: mark,
            page_path: window.location.pathname
          });
        }
      });
    });
  }

  // 7. Video Play Tracking (if videos exist)
  function trackVideoPlays() {
    const videos = document.querySelectorAll('video');

    videos.forEach(video => {
      video.addEventListener('play', function() {
        pushEvent('video_play', {
          video_url: this.currentSrc || this.src,
          video_title: this.title || 'Untitled',
          page_path: window.location.pathname
        });
      });
    });
  }

  // 8. Gallery Image Click Tracking
  function trackGalleryClicks() {
    const galleryImages = document.querySelectorAll('.gallery img, .portfolio img, [class*="image-grid"] img');

    galleryImages.forEach(img => {
      img.addEventListener('click', function() {
        pushEvent('gallery_image_click', {
          image_url: this.src,
          image_alt: this.alt || 'No alt text',
          page_path: window.location.pathname
        });
      });
    });
  }

  // Initialize all tracking on page load
  function initTracking() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        trackContactForm();
        trackWhatsAppClicks();
        trackPhoneClicks();
        trackQuoteRequests();
        trackServicePageViews();
        trackScrollDepth();
        trackVideoPlays();
        trackGalleryClicks();
      });
    } else {
      // DOM already loaded
      trackContactForm();
      trackWhatsAppClicks();
      trackPhoneClicks();
      trackQuoteRequests();
      trackServicePageViews();
      trackScrollDepth();
      trackVideoPlays();
      trackGalleryClicks();
    }
  }

  // Start tracking
  initTracking();

})();
