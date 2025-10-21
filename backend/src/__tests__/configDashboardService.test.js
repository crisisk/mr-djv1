const path = require('path');

jest.mock('fs', () => ({
  statSync: jest.fn()
}));

const mockManagedEnv = {
  loadFromDiskSync: jest.fn(),
  getStorePath: jest.fn(),
  write: jest.fn()
};

jest.mock('../lib/managedEnv', () => mockManagedEnv);

const mockDashboardConfig = {
  enabled: true,
  managedKeys: [],
  sections: [],
  storePath: '/tmp/config.env'
};

const mockReload = jest.fn();

jest.mock('../config', () => ({
  dashboard: mockDashboardConfig,
  reload: mockReload
}));

const fs = require('fs');
const config = require('../config');
const configDashboardService = require('../services/configDashboardService');

describe('configDashboardService', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockManagedEnv.loadFromDiskSync.mockReturnValue({});
    mockManagedEnv.getStorePath.mockReturnValue(path.join(process.cwd(), 'config', '.env.managed'));
    mockManagedEnv.write.mockResolvedValue();

    fs.statSync.mockReturnValue({ mtime: new Date('2024-01-02T03:04:05Z') });

    config.dashboard.managedKeys = [];
    config.dashboard.sections = [];

    global.roleState = { roles: [], assignments: {} };
    global.assignments = {};
    global.updateRoleAssignments = jest.fn(async (incomingAssignments) => {
      global.roleState = { roles: [{ id: 'admin' }], assignments: incomingAssignments };
      return global.roleState;
    });
  });

  afterEach(() => {
    delete process.env.SECRET;
    delete process.env.FALLBACK;
    delete process.env.SHORT;
    delete process.env.REMOVE;
    delete process.env.NUMERIC;
  });

  it('masks values in getState and returns metadata', () => {
    config.dashboard.managedKeys = ['SECRET', 'FALLBACK', 'SHORT'];
    config.dashboard.sections = [
      { id: 'main', label: 'Main', description: 'Primary', keys: ['SECRET', 'FALLBACK', 'SHORT'] }
    ];

    mockManagedEnv.loadFromDiskSync.mockReturnValue({ SECRET: 'supersecret', SHORT: 'abc' });
    process.env.FALLBACK = 'fallback';

    const state = configDashboardService.getState();

    const entriesByName = Object.fromEntries(state.entries.map((entry) => [entry.name, entry]));

    expect(entriesByName.SECRET.preview).toBe('*******cret');
    expect(entriesByName.FALLBACK.preview).toBe('****back');
    expect(entriesByName.SHORT.preview).toBe('***');

    expect(entriesByName.SECRET.hasValue).toBe(true);
    expect(entriesByName.FALLBACK.hasValue).toBe(true);
    expect(entriesByName.SHORT.hasValue).toBe(true);

    expect(state.metadata.storePath).toBe('config/.env.managed');
    expect(state.metadata.lastModified).toBe('2024-01-02T03:04:05.000Z');

    expect(fs.statSync).toHaveBeenCalledWith(path.join(process.cwd(), 'config', '.env.managed'));
    expect(state.groups[0].entries).toHaveLength(3);
  });

  it('updateValues normalizes entries, removes blanks, and reloads config', async () => {
    config.dashboard.managedKeys = ['SECRET', 'REMOVE', 'NUMERIC'];

    mockManagedEnv.loadFromDiskSync.mockReturnValue({ SECRET: 'old-secret', REMOVE: 'keep-me' });

    process.env.SECRET = 'old-secret';
    process.env.REMOVE = 'keep-me';

    global.assignments = { user1: ['admin'] };

    const state = await configDashboardService.updateValues({
      SECRET: 'newSecret',
      REMOVE: '',
      NUMERIC: 42,
      UNUSED: 'ignored'
    });

    expect(mockManagedEnv.write).toHaveBeenCalledWith({ SECRET: 'newSecret', NUMERIC: '42' });
    expect(config.reload).toHaveBeenCalledTimes(1);
    expect(global.updateRoleAssignments).toHaveBeenCalledWith(global.assignments);

    expect(process.env.SECRET).toBe('newSecret');
    expect(process.env.REMOVE).toBeUndefined();
    expect(process.env.NUMERIC).toBe('42');

    const entriesByName = Object.fromEntries(state.entries.map((entry) => [entry.name, entry]));

    expect(entriesByName.SECRET.preview).toBe('*****cret');
    expect(entriesByName.SECRET.hasValue).toBe(true);

    expect(entriesByName.REMOVE.preview).toBeNull();
    expect(entriesByName.REMOVE.hasValue).toBe(false);

    expect(entriesByName.NUMERIC.preview).toBe('**');
    expect(entriesByName.NUMERIC.hasValue).toBe(true);
  });

  it('throws an error when payload is not a plain object', async () => {
    await expect(configDashboardService.updateValues(null)).rejects.toThrow('Invalid payload');
    await expect(configDashboardService.updateValues('string')).rejects.toThrow('Invalid payload');
    await expect(configDashboardService.updateValues([])).rejects.toThrow('Invalid payload');
  });
});
