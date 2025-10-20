jest.mock('../lib/managedEnv', () => ({
  loadFromDiskSync: jest.fn(() => ({})),
  getStorePath: jest.fn(() => '/tmp/managed.env'),
  loadToProcessEnv: jest.fn(),
  write: jest.fn()
}));

const ORIGINAL_ENV = { ...process.env };

function loadManagedEnv() {
  return require('../lib/managedEnv');
}

function loadFeatureFlags() {
  return require('../lib/featureFlags');
}

describe('featureFlags', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('returns manifest defaults when no overrides are configured', () => {
    const managedEnv = loadManagedEnv();
    managedEnv.loadFromDiskSync.mockReturnValue({});
    const featureFlags = loadFeatureFlags();

    const personalization = featureFlags.getFlag('personalization');
    const telemetry = featureFlags.getFlag('telemetry');

    expect(personalization).toMatchObject({
      key: 'personalization',
      defaultState: true,
      value: true
    });
    expect(telemetry).toMatchObject({
      key: 'telemetry',
      defaultState: true,
      value: true
    });
  });

  it('applies managed environment overrides and process env precedence', () => {
    const managedEnv = loadManagedEnv();
    managedEnv.loadFromDiskSync.mockReturnValue({ FLAG_TELEMETRY: 'off' });
    process.env.FLAG_TELEMETRY = 'on';
    process.env.FLAG_RENTGUY_INTEGRATION = '0';

    const featureFlags = loadFeatureFlags();

    expect(featureFlags.isEnabled('telemetry')).toBe(true);
    expect(featureFlags.getFlag('telemetry')).toMatchObject({ value: true });
    expect(featureFlags.isEnabled('rentguy-integration')).toBe(false);
    expect(featureFlags.getFlag('rentguy-integration')).toMatchObject({ value: false, defaultState: true });
  });

  it('caches manifest reads between calls', () => {
    const managedEnv = loadManagedEnv();
    managedEnv.loadFromDiskSync.mockReturnValue({});
    const fs = require('fs');
    const dateSpy = jest.spyOn(Date, 'now').mockReturnValue(0);
    const readSpy = jest.spyOn(fs, 'readFileSync');

    const featureFlags = loadFeatureFlags();

    expect(featureFlags.isEnabled('telemetry')).toBe(true);
    expect(featureFlags.isEnabled('telemetry')).toBe(true);

    expect(readSpy).toHaveBeenCalledTimes(1);

    readSpy.mockRestore();
    dateSpy.mockRestore();
  });
});
