let revealObserver = null;

const ensureObserver = () => {
  if (revealObserver || !('IntersectionObserver' in window)) return;
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -10% 0px',
    }
  );
};

export const prepareRevealElement = (element) => {
  if (!element) return;
  element.style.opacity = '0';
  element.style.transform = 'translateY(16px)';
  element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

  ensureObserver();
  if (revealObserver) {
    revealObserver.observe(element);
  } else {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }
};

export const registerRevealTargets = (selector) => {
  document.querySelectorAll(selector).forEach(prepareRevealElement);
};

export const observeSection = (element, callback) => {
  if (!element || typeof callback !== 'function') return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback();
            observerInstance.disconnect();
          }
        });
      },
      { rootMargin: '0px 0px -20% 0px' }
    );

    observer.observe(element);
  } else {
    callback();
  }
};
