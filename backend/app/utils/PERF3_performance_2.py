// Performance monitoring
const SW_METRICS = {
  cacheHits: 0,
  cacheMisses: 0,
  networkFetchTime: [],
  cacheLoadTime: []
};

// Add to fetch event handler for monitoring
const startTime = performance.now();
if (cachedResponse) {
  SW_METRICS.cacheHits++;
  SW_METRICS.cacheLoadTime.push(performance.now() - startTime);
} else {
  SW_METRICS.cacheMisses++;
  SW_METRICS.networkFetchTime.push(performance.now() - startTime);
}
