const ORIGINAL_ENV = { ...process.env };

describe('telemetry bootstrap', () => {
  const loadTelemetry = (configOverrides = {}) => {
    const startMock = jest.fn().mockResolvedValue();
    const shutdownMock = jest.fn().mockResolvedValue();
    const instances = [];

    class NodeSDKMock {
      constructor(options) {
        this.options = options;
        this.start = startMock;
        this.shutdown = shutdownMock;
        instances.push(this);
      }
    }

    const traceExporterMock = jest.fn(function TraceExporter(options) {
      this.options = options;
    });
    const metricExporterMock = jest.fn(function MetricExporter(options) {
      this.options = options;
    });
    const metricReaderMock = jest.fn(function MetricReader(options) {
      this.options = options;
    });
    const resourceMock = jest.fn(function Resource(attrs) {
      this.attributes = attrs;
    });
    const instrumentationsMock = jest.fn(() => ['auto']);
    const logger = { info: jest.fn(), error: jest.fn() };

    jest.doMock('@opentelemetry/sdk-node', () => ({ NodeSDK: NodeSDKMock }));
    jest.doMock('@opentelemetry/auto-instrumentations-node', () => ({
      getNodeAutoInstrumentations: instrumentationsMock
    }));
    jest.doMock('@opentelemetry/exporter-trace-otlp-http', () => ({ OTLPTraceExporter: traceExporterMock }));
    jest.doMock('@opentelemetry/exporter-metrics-otlp-http', () => ({ OTLPMetricExporter: metricExporterMock }));
    jest.doMock('@opentelemetry/sdk-metrics', () => ({ PeriodicExportingMetricReader: metricReaderMock }));
    jest.doMock('@opentelemetry/resources', () => ({ Resource: resourceMock }));
    jest.doMock('@opentelemetry/semantic-conventions', () => ({
      SemanticResourceAttributes: {
        SERVICE_NAME: 'service.name',
        SERVICE_VERSION: 'service.version',
        DEPLOYMENT_ENVIRONMENT: 'deployment.environment'
      }
    }));
    jest.doMock('../config', () => ({
      serviceName: 'mr-dj-service',
      version: '1.2.3',
      env: 'staging',
      ...configOverrides
    }));
    jest.doMock('../lib/logger', () => ({ logger }));

    // eslint-disable-next-line global-require
    const telemetry = require('../lib/telemetry');
    return {
      telemetry,
      startMock,
      shutdownMock,
      instances,
      traceExporterMock,
      metricExporterMock,
      metricReaderMock,
      resourceMock,
      instrumentationsMock,
      logger
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

  it('starts the NodeSDK with default exporters when no OTLP endpoints are provided', async () => {
    const { telemetry, instances, logger } = loadTelemetry();

    await telemetry.startTelemetry();

    expect(instances).toHaveLength(1);
    const options = instances[0].options;
    expect(options.traceExporter).toBeUndefined();
    expect(options.metricReader).toBeUndefined();
    expect(logger.info).toHaveBeenCalledWith('Telemetry initialized');
  });

  it('constructs OTLP exporters when endpoints are configured', async () => {
    process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT = 'https://otel.example/traces';
    process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT = 'https://otel.example/metrics';

    const { telemetry, instances, traceExporterMock, metricExporterMock, metricReaderMock } = loadTelemetry();

    await telemetry.startTelemetry();

    expect(traceExporterMock).toHaveBeenCalledWith({ url: 'https://otel.example/traces' });
    expect(metricExporterMock).toHaveBeenCalledWith({ url: 'https://otel.example/metrics' });
    expect(metricReaderMock).toHaveBeenCalledWith({
      exporter: expect.objectContaining({ options: { url: 'https://otel.example/metrics' } }),
      exportIntervalMillis: 15000
    });

    const options = instances[0].options;
    expect(options.traceExporter).toEqual(expect.objectContaining({ options: { url: 'https://otel.example/traces' } }));
    expect(options.metricReader).toEqual(expect.objectContaining({ options: expect.any(Object) }));
  });

  it('logs initialization failures without throwing', async () => {
    const { telemetry, startMock, logger } = loadTelemetry();
    const failure = new Error('sdk failed');
    startMock.mockRejectedValueOnce(failure);

    await telemetry.startTelemetry();

    expect(logger.error).toHaveBeenCalledWith({ err: failure }, 'Failed to initialize telemetry');
  });
});
