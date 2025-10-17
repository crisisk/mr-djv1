const { NodeSDK } = require('@opentelemetry/sdk-node');
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const config = require('../config');
const { logger } = require('./logger');

let sdk = null;

function createTraceExporter() {
  if (!process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT) {
    return undefined;
  }
  return new OTLPTraceExporter({ url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT });
}

function createMetricReader() {
  if (!process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT) {
    return undefined;
  }
  const exporter = new OTLPMetricExporter({ url: process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT });
  return new PeriodicExportingMetricReader({ exporter, exportIntervalMillis: 15000 });
}

async function startTelemetry() {
  if (process.env.OTEL_ENABLED === 'false' || sdk) {
    return;
  }

  sdk = new NodeSDK({
    traceExporter: createTraceExporter(),
    metricReader: createMetricReader(),
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: config.serviceName,
      [SemanticResourceAttributes.SERVICE_VERSION]: config.version,
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: config.env
    }),
    instrumentations: [getNodeAutoInstrumentations()]
  });

  try {
    await sdk.start();
    logger.info('Telemetry initialized');
  } catch (error) {
    logger.error({ err: error }, 'Failed to initialize telemetry');
  }
}

async function shutdownTelemetry() {
  if (!sdk) {
    return;
  }

  try {
    await sdk.shutdown();
  } catch (error) {
    logger.error({ err: error }, 'Failed to shutdown telemetry');
  } finally {
    sdk = null;
  }
}

module.exports = {
  startTelemetry,
  shutdownTelemetry
};
