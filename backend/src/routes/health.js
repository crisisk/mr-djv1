const express = require('express');
const config = require('../config');
const { getContactServiceStatus } = require('../services/contactService');

const router = express.Router();

router.get('/', (_req, res) => {
  const { databaseConnected, storageStrategy } = getContactServiceStatus();

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: config.serviceName,
    version: config.version,
    environment: config.env,
    uptime: process.uptime(),
    dependencies: {
      database: databaseConnected,
      storageStrategy
    }
  });
});

module.exports = router;
