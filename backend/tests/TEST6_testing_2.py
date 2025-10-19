module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ['**/*.visual.spec.{js,jsx,ts,tsx}'],
  setupFilesAfterEnv: ['<rootDir>/setup-visual-tests.js'],
  testTimeout: 30000,
};
