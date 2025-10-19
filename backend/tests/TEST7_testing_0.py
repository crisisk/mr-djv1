// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      // Number of runs to perform
      numberOfRuns: 3,
      
      // URLs to test
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/about',
        'http://localhost:3000/contact',
      ],
      
      // Custom settings for Lighthouse
      settings: {
        preset: 'desktop',
        chromeFlags: ['--no-sandbox', '--headless'],
      },
      
      // Start server command (if needed)
      startServerCommand: 'npm run start',
      
      // Wait for server to be ready
      startServerReadyPattern: 'Server is running on port',
    },
    
    assert: {
      // Performance score thresholds
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        
        // Specific metrics
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'interactive': ['error', { maxNumericValue: 3500 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
      },
    },
    
    upload: {
      // Upload results to temporary storage
      target: 'temporary-public-storage',
      
      // Optional: Configure GitHub status integration
      githubStatusContextSuffix: 'Lighthouse',
    },
  },
};
