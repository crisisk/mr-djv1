// src/components/UserBehaviorTracker.jsx
import React, { useEffect } from 'react';
import posthog from 'posthog-js';

const UserBehaviorTracker = () => {
  useEffect(() => {
    // Initialize PostHog
    posthog.init('YOUR_POSTHOG_API_KEY', {
      api_host: 'https://app.posthog.com',
      loaded: () => {
        console.log('PostHog initialized');
      },
    });

    // Track page views
    posthog.capture('$pageview');

    // Track clicks
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (target.tagName === 'A' || target.tagName === 'BUTTON') {
        posthog.capture('click', { element: target.tagName, text: target.innerText });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target;
      posthog.capture('form_submit', { formId: form.id });
    });

    // Track scroll events
    document.addEventListener('scroll', () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      posthog.capture('scroll', { scrollPercentage: Math.round(scrollPercentage) });
    });

    // Cleanup on unmount
    return () => {
      document.removeEventListener('click', () => {});
      document.removeEventListener('submit', () => {});
      document.removeEventListener('scroll', () => {});
    };
  }, []);

  return null; // This component does not render anything
};

export default UserBehaviorTracker;
