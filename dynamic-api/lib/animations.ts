/**
 * Framer Motion Animation Utilities
 * Professional animations for Mr DJ website
 */

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] as any }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.4 }
};

export const slideInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] as any }
};

export const slideInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] as any }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] as any }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

// Hover animations
export const hoverScale = {
  scale: 1.05,
  transition: { duration: 0.2 }
};

export const hoverLift = {
  y: -8,
  boxShadow: '0 14px 30px rgba(16, 24, 40, 0.12)',
  transition: { duration: 0.2 }
};

// Scroll animations
export const scrollFadeIn = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] as any }
};

// Button interactions
export const buttonTap = {
  scale: 0.98,
  transition: { duration: 0.1 }
};

// Page transitions
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};

// Gallery card animation
export const galleryCard = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  whileHover: {
    scale: 1.05,
    boxShadow: '0 14px 30px rgba(16, 24, 40, 0.15)',
    transition: { duration: 0.3 }
  },
  transition: { duration: 0.4 }
};

// Hero text animation
export const heroTitle = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.8,
    delay: 0.2,
    ease: [0.2, 0.8, 0.2, 1] as any
  }
};

export const heroSubtitle = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.6,
    delay: 0.4,
    ease: [0.2, 0.8, 0.2, 1] as any
  }
};

export const heroCTA = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.5,
    delay: 0.6,
    ease: [0.2, 0.8, 0.2, 1] as any
  }
};
