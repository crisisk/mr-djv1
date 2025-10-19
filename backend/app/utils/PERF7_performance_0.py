/**
 * @class LazyImageLoader
 * @description Handles lazy loading of images using Intersection Observer API
 * @author [Your Name]
 * @version 1.0.0
 */
class LazyImageLoader {
    /**
     * @constructor
     * @param {Object} options - Configuration options
     * @param {string} options.imageSelector - CSS selector for lazy images
     * @param {string} options.loadingClass - Class to apply while loading
     * @param {string} options.loadedClass - Class to apply after loading
     * @param {Object} options.observerOptions - IntersectionObserver options
     */
    constructor(options = {}) {
        // Default configuration
        this.config = {
            imageSelector: '.lazy-image',
            loadingClass: 'loading',
            loadedClass: 'loaded',
            observerOptions: {
                root: null,
                rootMargin: '50px 0px',
                threshold: 0.1
            },
            ...options
        };

        this.observer = null;
        this.stats = {
            totalImages: 0,
            loadedImages: 0,
            failures: 0
        };
    }

    /**
     * Initializes the lazy loading functionality
     * @returns {Promise<void>}
     */
    async init() {
        try {
            // Check for Intersection Observer support
            if (!('IntersectionObserver' in window)) {
                await this.loadIntersectionObserverPolyfill();
            }

            this.setupIntersectionObserver();
            this.observeImages();
            
            // Performance monitoring
            this.startPerformanceMonitoring();
        } catch (error) {
            console.error('Failed to initialize lazy loading:', error);
            this.fallbackToEagerLoading();
        }
    }

    /**
     * Sets up the Intersection Observer
     * @private
     */
    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, this.config.observerOptions);
    }

    /**
     * Starts observing all lazy images
     * @private
     */
    observeImages() {
        const images = document.querySelectorAll(this.config.imageSelector);
        this.stats.totalImages = images.length;

        images.forEach(img => {
            img.classList.add(this.config.loadingClass);
            this.observer.observe(img);
        });
    }

    /**
     * Loads an individual image
     * @param {HTMLImageElement} img - Image element to load
     * @private
     */
    async loadImage(img) {
        const start = performance.now();

        try {
            const src = img.dataset.src;
            if (!src) {
                throw new Error('No data-src attribute found');
            }

            await this.preloadImage(src);

            img.src = src;
            img.classList.remove(this.config.loadingClass);
            img.classList.add(this.config.loadedClass);
            
            this.stats.loadedImages++;
            this.logPerformance(start);
        } catch (error) {
            console.error(`Failed to load image: ${img.dataset.src}`, error);
            this.stats.failures++;
            img.classList.add('error');
        }
    }

    /**
     * Preloads an image
     * @param {string} src - Image source URL
     * @returns {Promise<void>}
     * @private
     */
    preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => reject(new Error(`Failed to load ${src}`));
            img.src = src;
        });
    }

    /**
     * Loads the Intersection Observer polyfill if needed
     * @private
     */
    async loadIntersectionObserverPolyfill() {
        await import('intersection-observer');
    }

    /**
     * Fallback for browsers without Intersection Observer support
     * @private
     */
    fallbackToEagerLoading() {
        const images = document.querySelectorAll(this.config.imageSelector);
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    }

    /**
     * Starts performance monitoring
     * @private
     */
    startPerformanceMonitoring() {
        this.performanceMetrics = {
            startTime: performance.now(),
            loadTimes: []
        };
    }

    /**
     * Logs performance metrics for an image load
     * @param {number} startTime - Start time of image load
     * @private
     */
    logPerformance(startTime) {
        const loadTime = performance.now() - startTime;
        this.performanceMetrics.loadTimes.push(loadTime);
    }

    /**
     * Gets performance statistics
     * @returns {Object} Performance metrics
     * @public
     */
    getPerformanceStats() {
        const loadTimes = this.performanceMetrics.loadTimes;
        return {
            totalImages: this.stats.totalImages,
            loadedImages: this.stats.loadedImages,
            failures: this.stats.failures,
            averageLoadTime: loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length,
            maxLoadTime: Math.max(...loadTimes),
            minLoadTime: Math.min(...loadTimes)
        };
    }
}

// Usage Example:
/*
// HTML
<img class="lazy-image" data-src="image.jpg" alt="Lazy loaded image">

// JavaScript
const lazyLoader = new LazyImageLoader({
    imageSelector: '.lazy-image',
    observerOptions: {
        rootMargin: '100px 0px'
    }
});

lazyLoader.init().then(() => {
    console.log('Lazy loading initialized');
});

// Later, check performance
const stats = lazyLoader.getPerformanceStats();
console.log('Performance stats:', stats);
*/

// Export for module usage
export default LazyImageLoader;
