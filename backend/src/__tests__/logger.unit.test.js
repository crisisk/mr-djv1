const ORIGINAL_ENV = { ...process.env };

describe('logger factory', () => {
  const setup = (configOverrides = {}) => {
    const createLoggerMock = jest.fn().mockReturnValue({});
    const errorsMock = jest.fn(() => 'errors');
    const timestampMock = jest.fn(() => 'timestamp');
    const splatMock = jest.fn(() => 'splat');
    const metadataMock = jest.fn(() => 'metadata');
    const jsonMock = jest.fn(() => 'json');
    const combineMock = jest.fn(() => 'combined');
    const consoleMock = jest.fn(function Console(options) {
      this.options = options;
    });

    jest.doMock('winston', () => ({
      createLogger: createLoggerMock,
      format: {
        errors: errorsMock,
        timestamp: timestampMock,
        splat: splatMock,
        metadata: metadataMock,
        json: jsonMock,
        combine: (...args) => {
          combineMock(...args);
          return 'combined';
        }
      },
      transports: {
        Console: consoleMock
      }
    }));

    jest.doMock('../config', () => ({
      env: 'production',
      serviceName: 'mr-dj-service',
      ...configOverrides
    }));

    // eslint-disable-next-line global-require
    const loggerModule = require('../lib/logger');

    return {
      loggerModule,
      createLoggerMock,
      metadataMock,
      consoleMock,
      combineMock
    };
  };

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    jest.clearAllMocks();
  });

  it('configures redaction metadata and respects LOG_LEVEL', () => {
    process.env.LOG_LEVEL = 'ERROR';
    process.env.NODE_ENV = 'production';

    const { createLoggerMock, metadataMock, consoleMock } = setup();

    expect(createLoggerMock).toHaveBeenCalledTimes(1);
    const options = createLoggerMock.mock.calls[0][0];
    expect(options.level).toBe('error');
    expect(options.defaultMeta).toEqual({ service: 'mr-dj-service', env: 'production' });

    expect(metadataMock).toHaveBeenCalledWith({
      fillExcept: ['message', 'level', 'timestamp', 'service', 'env']
    });

    expect(consoleMock).toHaveBeenCalledWith({
      format: 'combined',
      silent: false
    });
  });

  it('silences console output in the test environment', () => {
    process.env.NODE_ENV = 'test';
    const { consoleMock } = setup({ env: 'test' });

    const consoleOptions = consoleMock.mock.calls[0][0];
    expect(consoleOptions.silent).toBe(true);
  });

  it('merges custom metadata and transports when creating scoped loggers', () => {
    const { loggerModule, createLoggerMock } = setup();
    const customTransport = { name: 'custom' };

    loggerModule.createLogger({
      defaultMeta: { requestId: 'abc-123' },
      transports: [customTransport]
    });

    expect(createLoggerMock).toHaveBeenCalledTimes(2);
    const scopedOptions = createLoggerMock.mock.calls[1][0];
    expect(scopedOptions.defaultMeta).toEqual({
      service: 'mr-dj-service',
      env: 'production',
      requestId: 'abc-123'
    });
    expect(scopedOptions.transports).toEqual([customTransport]);
  });
});
