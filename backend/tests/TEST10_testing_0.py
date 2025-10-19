// accessibilityTest.js

const axe = require('axe-core');
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

/**
 * Configuration for accessibility testing
 * @type {Object}
 */
const axeConfig = {
  reporter: 'v2',
  rules: {
    'color-contrast': { enabled: true },
    'html-has-lang': { enabled: true },
    'valid-lang': { enabled: true },
    'aria-roles': { enabled: true },
    'aria-required-children': { enabled: true },
    'aria-required-parent': { enabled: true },
    'duplicate-id-active': { enabled: true },
    'duplicate-id-aria': { enabled: true },
  },
  resultTypes: ['violations'],
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa', 'best-practice'],
  },
};

/**
 * Runs accessibility tests on a specific URL
 * @param {string} url - The URL to test
 * @param {Object} options - Additional test options
 * @returns {Promise<Object>} Test results
 */
async function runAccessibilityTest(url, options = {}) {
  let driver;

  try {
    // Setup Chrome driver
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options().headless())
      .build();

    // Navigate to URL
    await driver.get(url);

    // Inject axe-core
    await driver.executeScript(axe.source);

    // Run accessibility tests
    const results = await driver.executeAsyncScript(async (config) => {
      const callback = arguments[arguments.length - 1];
      try {
        const results = await axe.run(document, config);
        callback(results);
      } catch (error) {
        callback({ error: error.message });
      }
    }, { ...axeConfig, ...options });

    return results;
  } catch (error) {
    throw new Error(`Accessibility test failed: ${error.message}`);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

module.exports = { runAccessibilityTest };
