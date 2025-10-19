// scripts/lighthouse-custom.js
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

/**
 * Runs a Lighthouse audit with custom configuration
 * @param {string} url - The URL to audit
 * @param {Object} opts - Custom options for the audit
 * @returns {Promise<Object>} - Lighthouse results
 */
async function runLighthouse(url, opts = {}) {
  try {
    // Launch Chrome
    const chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless', '--no-sandbox']
    });

    // Configure Lighthouse
    const options = {
      logLevel: 'info',
      output: 'html',
      port: chrome.port,
      ...opts
    };

    // Run Lighthouse
    const results = await lighthouse(url, options);
    
    // Save results
    const reportPath = path.join(__dirname, '../lighthouse-reports');
    if (!fs.existsSync(reportPath)) {
      fs.mkdirSync(reportPath, { recursive: true });
    }

    fs.writeFileSync(
      `${reportPath}/lighthouse-${Date.now()}.html`,
      results.report
    );

    // Close Chrome
    await chrome.kill();

    return results;
  } catch (error) {
    console.error('Lighthouse audit failed:', error);
    throw error;
  }
}

module.exports = { runLighthouse };
