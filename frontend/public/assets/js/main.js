import { initAnalytics } from './modules/analytics.js';
import { initNavigation } from './modules/navigation.js';
import { registerRevealTargets, observeSection } from './modules/reveal.js';
import { initHeroAnimations } from './modules/hero-animations.js';
import { initScrollAnimations } from './modules/scroll-animator.js';

const createHintDispatcher = () => {
  const appended = new Set();
  return (rel, href, attributes = {}) => {
    const key = `${rel}|${href}`;
    if (!rel || !href || appended.has(key)) {
      return;
    }
    const existing = document.head.querySelector(`link[rel="${rel}"][href="${href}"]`);
    if (existing) {
      appended.add(key);
      return;
    }
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    Object.entries(attributes).forEach(([attribute, value]) => {
      if (value) {
        link.setAttribute(attribute, value);
      }
    });
    document.head.appendChild(link);
    appended.add(key);
  };
};

const hintOnce = createHintDispatcher();

const scheduleIdle = (callback) => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout: 2000 });
  } else {
    window.setTimeout(callback, 0);
  }
};

const analytics = initAnalytics();

const bootstrap = async () => {
  initNavigation();
  initHeroAnimations();
  initScrollAnimations();
  registerRevealTargets('.usp-card, .service-card, .about-card, .faq-item');

  const pricingLink = document.querySelector('a[href="/pricing/"]');
  if (pricingLink) {
    const warmPricing = () => {
      hintOnce('prefetch', '/pricing/');
      hintOnce('modulepreload', '/assets/js/pricing.js');
      hintOnce('prefetch', '/assets/data/packages.json', {
        as: 'fetch',
        type: 'application/json',
        crossorigin: 'anonymous',
      });
    };

    pricingLink.addEventListener('pointerenter', warmPricing, { once: true });
    pricingLink.addEventListener('focus', warmPricing, { once: true });
  }

  const [{ initAudienceMatcher }, { initContactForm }, { initSocialProof }, { initPackageSection, initReviewSection }] = await Promise.all([
    import('./modules/audience.js'),
    import('./modules/contact.js'),
    import('./modules/social-proof.js'),
    import('./modules/commerce.js'),
  ]);

  initAudienceMatcher(analytics);
  initContactForm(analytics);
  initSocialProof(analytics);

  const packagesSection = document.getElementById('pakketten');
  const reviewsSection = document.getElementById('reviews');

  observeSection(packagesSection, () => initPackageSection(analytics));
  observeSection(reviewsSection, () => initReviewSection(analytics));

  // fallback prefetch if visitor scrolls straight to contact
  setTimeout(() => {
    initPackageSection(analytics);
    initReviewSection(analytics);
  }, 4000);

  scheduleIdle(() => {
    hintOnce('prefetch', '/assets/data/testimonials.json', {
      as: 'fetch',
      type: 'application/json',
      crossorigin: 'anonymous',
    });
    hintOnce('prefetch', '/assets/data/packages.json', {
      as: 'fetch',
      type: 'application/json',
      crossorigin: 'anonymous',
    });
  });
};

if ('requestIdleCallback' in window) {
  requestIdleCallback(bootstrap);
} else {
  window.addEventListener('DOMContentLoaded', bootstrap, { once: true });
}

console.log('%c🎧 Mister DJ Website', 'font-size: 20px; font-weight: bold; color: #00AEEF;');
console.log('%cDé feestspecialist van het Zuiden', 'font-size: 14px; color: #1A2C4B;');
console.log('%c100% Dansgarantie | 15+ jaar | 2500+ events', 'font-size: 12px; color: #D4AF37;');
