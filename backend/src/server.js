const app = require('./app');
const config = require('./config');

const server = app.listen(config.port, config.host, () => {
  console.log(`🚀 ${config.serviceName} running on port ${config.port}`);
  console.log(`📊 Environment: ${config.env}`);
  console.log(`🔗 Health check: http://localhost:${config.port}/health`);
});

['SIGTERM', 'SIGINT'].forEach((signal) => {
  process.on(signal, () => {
    console.log(`Received ${signal}, shutting down gracefully...`);
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });
});

module.exports = server;
