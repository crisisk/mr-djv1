const app = require('./app');
const config = require('./config');
const { logger } = require('./lib/logger');
const { startTelemetry, shutdownTelemetry } = require('./lib/telemetry');
const { migrateToLatest } = require('./lib/migrations');
const { closeAllQueues } = require('./lib/durableQueue');
const { closeAllRedisConnections } = require('./lib/redis');
const { startContactQueueWorker, stopContactQueueWorker } = require('./workers/contactQueueWorker');

async function bootstrap() {
  await startTelemetry();
  await migrateToLatest();
  startContactQueueWorker();

  return new Promise((resolve) => {
    const httpServer = app.listen(config.port, config.host, () => {
      logger.info({ port: config.port, host: config.host }, 'Service started');
      resolve(httpServer);
    });
  });
}

async function shutdown(server) {
  logger.info('Shutting down gracefully');

  await Promise.allSettled([
    new Promise((resolve) => {
      server.close(() => {
        resolve();
      });
    }),
    (async () => {
      stopContactQueueWorker();
    })(),
    closeAllQueues(),
    closeAllRedisConnections(),
    shutdownTelemetry()
  ]);

  logger.info('Shutdown complete');
  process.exit(0);
}

bootstrap()
  .then((server) => {
    ['SIGTERM', 'SIGINT'].forEach((signal) => {
      process.on(signal, () => {
        shutdown(server).catch((error) => {
          logger.error({ err: error}, 'Failed during shutdown');
          process.exit(1);
        });
      });
    });

    process.on('uncaughtException', (error) => {
      logger.error({ err: error }, 'Uncaught exception');
    });

    process.on('unhandledRejection', (reason) => {
      logger.error({ err: reason }, 'Unhandled rejection');
    });
  })
  .catch((error) => {
    logger.error({ err: error }, 'Failed to start service');
    process.exit(1);
  });

module.exports = bootstrap;
