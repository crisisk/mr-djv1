// src/components/UserBehaviorTracker.jsx
import { useEffect } from 'react';
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

    const handleClick = (e) => {
      const target = e.target;
      if (target.tagName === 'A' || target.tagName === 'BUTTON') {
        posthog.capture('click', { element: target.tagName, text: target.innerText });
      }
    };

    const handleSubmit = (e) => {
      const form = e.target;
      posthog.capture('form_submit', { formId: form.id });
    };

    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      posthog.capture('scroll', { scrollPercentage: Math.round(scrollPercentage) });
    };

    // Track clicks
    document.addEventListener('click', handleClick);

    // Track form submissions
    document.addEventListener('submit', handleSubmit);

    // Track scroll events
    document.addEventListener('scroll', handleScroll);

    // Cleanup on unmount
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('submit', handleSubmit);
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return null; // This component does not render anything
};

export default UserBehaviorTracker;
