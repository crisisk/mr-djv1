// accessibility.test.js

const { runAccessibilityTest } = require('./accessibilityTest');

describe('Accessibility Tests', () => {
  const testUrls = [
    'https://example.com',
    'https://example.com/about',
    // Add more URLs as needed
  ];

  testUrls.forEach((url) => {
    test(`${url} should be WCAG 2.1 AA compliant`, async () => {
      const results = await runAccessibilityTest(url);
      
      // Format violations for better reporting
      const violations = results.violations.map(violation => ({
        id: violation.id,
        impact: violation.impact,
        description: violation.description,
        nodes: violation.nodes.length,
        help: violation.help,
        helpUrl: violation.helpUrl,
      }));

      // Custom error message for violations
      if (violations.length > 0) {
        throw new Error(
          'Accessibility violations found:\n' +
          JSON.stringify(violations, null, 2)
        );
      }

      expect(violations.length).toBe(0);
    }, 30000); // Timeout of 30 seconds
  });
});
