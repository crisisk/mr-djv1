// resourceLoader.js

class ResourceLoader {
    constructor() {
        // Configuration for resource loading
        this.config = {
            retryAttempts: 3,
            retryDelay: 1000,
            timeout: 5000,
            criticalResources: [
                '/fonts/MainFont-Regular.woff2',
                '/images/hero.webp',
                '/css/critical.css'
            ]
        };

        // Performance metrics storage
        this.metrics = {
            loadTimes: {},
            failures: {}
        };

        this.init();
    }

    /**
     * Initialize the resource loader
     */
    async init() {
        try {
            // Check for preload support
            if (!this.supportsPreload()) {
                this.fallbackLoading();
                return;
            }

            // Monitor preloaded resources
            this.monitorPreloadedResources();

            // Load critical resources
            await this.loadCriticalResources();

            // Report performance metrics
            this.reportMetrics();
        } catch (error) {
            console.error('Resource loader initialization failed:', error);
            this.handleError(error);
        }
    }

    /**
     * Check if browser supports preload
     * @returns {boolean}
     */
    supportsPreload() {
        const link = document.createElement('link');
        return link.relList && link.relList.supports && link.relList.supports('preload');
    }

    /**
     * Load a single resource with retry logic
     * @param {string} url - Resource URL
     * @returns {Promise}
     */
    async loadResource(url) {
        const startTime = performance.now();
        let attempts = 0;

        while (attempts < this.config.retryAttempts) {
            try {
                const response = await Promise.race([
                    fetch(url),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Timeout')), this.config.timeout)
                    )
                ]);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Record successful load time
                this.metrics.loadTimes[url] = performance.now() - startTime;
                return response;

            } catch (error) {
                attempts++;
                if (attempts === this.config.retryAttempts) {
                    this.metrics.failures[url] = error.message;
                    throw error;
                }
                await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
            }
        }
    }

    /**
     * Monitor preloaded resources and their performance
     */
    monitorPreloadedResources() {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.initiatorType === 'preload') {
                    this.metrics.loadTimes[entry.name] = entry.duration;
                }
            });
        });

        observer.observe({ entryTypes: ['resource'] });
    }

    /**
     * Load all critical resources
     * @returns {Promise}
     */
    async loadCriticalResources() {
        const loadPromises = this.config.criticalResources.map(url => 
            this.loadResource(url)
        );

        try {
            await Promise.all(loadPromises);
        } catch (error) {
            console.error('Failed to load critical resources:', error);
            this.handleError(error);
        }
    }

    /**
     * Fallback loading mechanism for browsers without preload support
     */
    fallbackLoading() {
        this.config.criticalResources.forEach(url => {
            if (url.includes('.css')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = url;
                document.head.appendChild(link);
            } else if (url.includes('.woff2')) {
                const font = new FontFace('MainFont', `url(${url})`);
                font.load().then(font => document.fonts.add(font));
            }
        });
    }

    /**
     * Report performance metrics
     */
    reportMetrics() {
        // Log metrics
        console.log('Resource Load Times:', this.metrics.loadTimes);
        
        // Send metrics to analytics if available
        if (window.analytics) {
            window.analytics.logPerformance({
                resourceMetrics: this.metrics
            });
        }

        // Report to Performance API
        Object.entries(this.metrics.loadTimes).forEach(([url, duration]) => {
            performance.mark(`${url}-loaded`);
        });
    }

    /**
     * Handle errors during resource loading
     * @param {Error} error 
     */
    handleError(error) {
        // Log error
        console.error('Resource loading error:', error);

        // Report to error tracking service if available
        if (window.errorTracker) {
            window.errorTracker.captureError(error);
        }

        // Trigger fallback loading if necessary
        this.fallbackLoading();
    }
}

// Initialize the resource loader
const resourceLoader = new ResourceLoader();

// Export for use in other modules
export default resourceLoader;
