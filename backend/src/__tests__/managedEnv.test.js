const fs = require('fs');
const os = require('os');
const path = require('path');

const managedEnv = require('../lib/managedEnv');

const ORIGINAL_ENV = { ...process.env };

describe('managed environment store', () => {
  let tempDir;
  let storePath;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'managed-env-test-'));
    storePath = path.join(tempDir, 'managed.env');
    process.env = {
      ...ORIGINAL_ENV,
      CONFIG_DASHBOARD_STORE_PATH: storePath
    };
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('returns an empty object when the store does not exist or is blank', () => {
    expect(managedEnv.loadFromDiskSync()).toEqual({});

    fs.writeFileSync(storePath, '\n\n');
    expect(managedEnv.loadFromDiskSync()).toEqual({});
  });

  it('loads valid values into process.env and preserves strings', () => {
    fs.writeFileSync(storePath, 'PORT=4500\nNAME="Mr DJ"\n');

    const values = managedEnv.loadToProcessEnv();
    expect(values).toEqual({ PORT: '4500', NAME: 'Mr DJ' });
    expect(process.env.PORT).toBe('4500');
    expect(process.env.NAME).toBe('Mr DJ');
  });

  it('returns an empty object when parsing fails', () => {
    fs.writeFileSync(storePath, 'PORT=3000');
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const parseSpy = jest
      .spyOn(require('dotenv'), 'parse')
      .mockImplementation(() => {
        throw new Error('invalid format');
      });

    expect(managedEnv.loadFromDiskSync()).toEqual({});
    expect(warnSpy).toHaveBeenCalledWith(
      '[managedEnv] Failed to parse managed environment file:',
      'invalid format'
    );

    parseSpy.mockRestore();
    warnSpy.mockRestore();
  });

  it('writes sorted keys with escaped values', async () => {
    await managedEnv.write({
      DATABASE_URL: 'postgres://example',
      EMPTY: '',
      API_KEY: 'with spaces',
      QUOTE: 'value"with"quotes'
    });

    const contents = fs.readFileSync(storePath, 'utf8');
    expect(contents).toBe(
      'API_KEY="with spaces"\nDATABASE_URL=postgres://example\nEMPTY=\nQUOTE="value\\"with\\"quotes"\n'
    );
  });

  it('resolves custom store paths from CONFIG_DASHBOARD_STORE_PATH', () => {
    expect(managedEnv.getStorePath()).toBe(storePath);
  });
});
