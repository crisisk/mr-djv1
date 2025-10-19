export const initNavigation = () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navbar = document.querySelector('.navbar');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      const offset = 80;
      const targetPosition = target.offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    });
  });

  if (navbar) {
    const updateShadow = () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 12px rgba(26, 44, 75, 0.15)';
      } else {
        navbar.style.boxShadow = '0 2px 8px rgba(26, 44, 75, 0.1)';
      }
    };

    window.addEventListener('scroll', updateShadow, { passive: true });
    updateShadow();
  }
};
