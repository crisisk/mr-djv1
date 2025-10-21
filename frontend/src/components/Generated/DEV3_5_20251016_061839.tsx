// src/components/UserBehaviorTracker.jsx
import { useEffect } from 'react';
import posthog from 'posthog-js';
import { isValidPosthogKey, runtimeConfig } from '../../config/runtimeConfig';

let posthogInitialized = false;

const isBrowser = typeof window !== 'undefined';

const UserBehaviorTracker = () => {
  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    const { apiKey, apiHost } = runtimeConfig.analytics.posthog;

    if (!isValidPosthogKey(apiKey)) {
      console.warn('PostHog initialisatie overgeslagen: ontbrekende of ongeldige API-sleutel.');
      return;
    }

    if (posthogInitialized) {
      console.debug('PostHog is al geïnitialiseerd; tweede initialisatie wordt voorkomen.');
      return;
    }

    try {
      posthog.init(apiKey, {
        api_host: apiHost,
        loaded: () => {
          console.log('PostHog initialized');
        },
      });

      posthog.capture('$pageview');
      posthogInitialized = true;
    } catch (error) {
      console.error('PostHog kon niet worden geïnitialiseerd.', error);
      return;
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;

      if (!target) {
        return;
      }

      if (target.tagName === 'A' || target.tagName === 'BUTTON') {
        posthog.capture('click', { element: target.tagName, text: target.innerText });
      }
    };

    const handleSubmit = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement | null;

      if (!form) {
        return;
      }

      posthog.capture('form_submit', { formId: form.id });
    };

    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollableHeight <= 0) {
        return;
      }

      const scrollPercentage = (window.scrollY / scrollableHeight) * 100;
      posthog.capture('scroll', { scrollPercentage: Math.round(scrollPercentage) });
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('submit', handleSubmit);
    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('submit', handleSubmit);
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return null; // This component does not render anything
};

export default UserBehaviorTracker;
