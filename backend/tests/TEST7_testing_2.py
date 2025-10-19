const { runLighthouse } = require('./scripts/lighthouse-custom');

// Run custom audit
async function performAudit() {
  try {
    const results = await runLighthouse('https://your-site.com', {
      onlyCategories: ['performance', 'accessibility'],
      preset: 'desktop'
    });
    
    console.log('Audit complete:', results.lhr.categories);
  } catch (error) {
    console.error('Audit failed:', error);
  }
}
