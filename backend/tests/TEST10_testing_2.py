// jest.config.js

module.exports = {
  testTimeout: 30000,
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironment: 'node',
  verbose: true,
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: './reports',
      outputName: 'accessibility-report.xml',
    }],
  ],
};
