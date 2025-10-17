/**
 * ScrollAnimator - A lightweight scroll-based animation library
 * @version 1.0.0
 */
export class ScrollAnimator {
    constructor() {
        this.observers = {};
        this.counters = new Map();
        this.init();
    }

    init() {
        // Initialize progress bar
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'scroll-progress';
        this.progressBar.style.cssText = 'position:fixed;top:0;left:0;height:3px;width:0;background:#00AEEF;z-index:9999;transition:width 0.2s';
        document.body.appendChild(this.progressBar);

        // Update progress bar on scroll
        window.addEventListener('scroll', () => {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            this.progressBar.style.width = `${(winScroll / height) * 100}%`;
        });
    }

    /**
     * Create and configure Intersection Observer
     * @param {Object} options - Observer options
     * @param {Function} callback - Callback function
     * @returns {IntersectionObserver}
     */
    createObserver(options, callback) {
        return new IntersectionObserver((entries) => {
            entries.forEach(callback);
        }, options);
    }

    /**
     * Fade in elements on scroll
     * @param {string} selector - CSS selector
     */
    fadeIn(selector) {
        const elements = document.querySelectorAll(selector);
        const observer = this.createObserver({
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }, (entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });

        elements.forEach(el => {
            el.style.cssText = 'opacity:0;transform:translateY(20px);transition:all 0.6s ease-out';
            observer.observe(el);
        });
    }

    /**
     * Slide elements from specified direction
     * @param {string} selector - CSS selector
     * @param {string} direction - 'left', 'right', or 'bottom'
     */
    slideIn(selector, direction = 'left') {
        const elements = document.querySelectorAll(selector);
        const transforms = {
            left: 'translateX(-100px)',
            right: 'translateX(100px)',
            bottom: 'translateY(100px)'
        };

        const observer = this.createObserver({
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }, (entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translate(0)';
            }
        });

        elements.forEach(el => {
            el.style.cssText = `opacity:0;transform:${transforms[direction]};transition:all 0.6s ease-out`;
            observer.observe(el);
        });
    }

    /**
     * Stagger animations for list items
     * @param {string} selector - CSS selector
     * @param {number} delay - Delay between items in ms
     */
    stagger(selector, delay = 100) {
        const elements = document.querySelectorAll(selector);
        const observer = this.createObserver({
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }, (entry) => {
            if (entry.isIntersecting) {
                const index = Array.from(elements).indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * delay}ms`;
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });

        elements.forEach(el => {
            el.style.cssText = 'opacity:0;transform:translateY(20px);transition:all 0.6s ease-out';
            observer.observe(el);
        });
    }

    /**
     * Create parallax background effect
     * @param {string} selector - CSS selector
     * @param {number} speed - Parallax speed
     */
    parallax(selector, speed = 0.5) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.style.cssText = 'background-position:center;background-size:cover;background-attachment:fixed';
            window.addEventListener('scroll', () => {
                const offset = window.pageYOffset;
                el.style.backgroundPositionY = `${offset * speed}px`;
            });
        });
    }

    /**
     * Animate counter from 0 to target number
     * @param {string} selector - CSS selector
     * @param {number} duration - Animation duration in ms
     */
    counter(selector, duration = 2000) {
        const elements = document.querySelectorAll(selector);
        const observer = this.createObserver({
            threshold: 0.5
        }, (entry) => {
            if (entry.isIntersecting && !this.counters.has(entry.target)) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                const increment = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        entry.target.textContent = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        entry.target.textContent = target;
                    }
                };

                this.counters.set(entry.target, true);
                updateCounter();
            }
        });

        elements.forEach(el => observer.observe(el));
    }
}

export function initScrollAnimations() {
    const animator = new ScrollAnimator();

    // Fade in section headers
    animator.fadeIn('.section-header');

    // Slide in service cards from left
    animator.slideIn('.service-card', 'left');

    // Slide in about cards from right
    animator.slideIn('.about-card', 'right');

    // Stagger USP cards
    animator.stagger('.usp-card', 120);

    // Fade in package cards
    animator.fadeIn('.package-card');

    // Stagger FAQ items
    animator.stagger('.faq-item', 80);

    // Fade in media items
    animator.fadeIn('.media-item');

    // Fade in social proof items
    animator.fadeIn('.social-proof-item');
}
