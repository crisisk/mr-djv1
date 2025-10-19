// playwright.config.ts

import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  use: {
    baseURL: process.env.BASE_URL || 'https://example.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ]
};

export default config;
