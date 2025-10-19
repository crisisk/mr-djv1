const customConfig = {
  rules: {
    'color-contrast': { enabled: false }, // Disable specific rules
    'custom-rule': { enabled: true },     // Enable custom rules
  },
  tags: ['wcag2aa'],                      // Specific WCAG level
  reporter: 'v2',
  resultTypes: ['violations', 'incomplete'],
};

await runAccessibilityTest(url, customConfig);
