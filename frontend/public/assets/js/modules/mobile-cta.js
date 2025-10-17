/**
 * Mobile CTA Bar Module
 * Controls visibility and behavior of the sticky mobile call-to-action bar
 */

export function initMobileCTA() {
    const ctaBar = document.getElementById('mobileCTABar');

    if (!ctaBar) {
        return;
    }

    let isVisible = false;
    const scrollThreshold = 300; // Show after scrolling 300px
    let ticking = false;

    /**
     * Handle scroll event with throttling
     */
    function handleScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                // Show CTA bar after scrolling past threshold
                if (scrollTop > scrollThreshold && !isVisible) {
                    ctaBar.classList.add('visible');
                    isVisible = true;
                }
                // Hide CTA bar when scrolling back to top
                else if (scrollTop <= scrollThreshold && isVisible) {
                    ctaBar.classList.remove('visible');
                    isVisible = false;
                }

                ticking = false;
            });

            ticking = true;
        }
    }

    /**
     * Track CTA button clicks for analytics
     */
    function trackCTAClick(buttonType) {
        // Track with gtag if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'mobile_cta_click', {
                'button_type': buttonType,
                'event_category': 'engagement',
                'event_label': `Mobile CTA ${buttonType}`
            });
        }

        console.log(`Mobile CTA clicked: ${buttonType}`);
    }

    // Add click tracking to CTA buttons
    const callButton = ctaBar.querySelector('.mobile-cta-call');
    const bookButton = ctaBar.querySelector('.mobile-cta-book');

    if (callButton) {
        callButton.addEventListener('click', () => {
            trackCTAClick('call');
        });
    }

    if (bookButton) {
        bookButton.addEventListener('click', (e) => {
            trackCTAClick('book');
            // Smooth scroll to contact section
            e.preventDefault();
            const targetSection = document.querySelector('#contact');
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Check initial scroll position
    handleScroll();

    console.log('✓ Mobile CTA bar initialized');
}

/**
 * Show CTA bar immediately (useful for specific pages/sections)
 */
export function showMobileCTA() {
    const ctaBar = document.getElementById('mobileCTABar');
    if (ctaBar) {
        ctaBar.classList.add('visible');
    }
}

/**
 * Hide CTA bar
 */
export function hideMobileCTA() {
    const ctaBar = document.getElementById('mobileCTABar');
    if (ctaBar) {
        ctaBar.classList.remove('visible');
    }
}
