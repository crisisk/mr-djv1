import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: '<rootDir>/tsconfig.test.json',
        allowJs: true,
      },
    ],
  },
  transformIgnorePatterns: [],
  testMatch: ['<rootDir>/src/**/*.test.ts?(x)'],
};

export default config;
