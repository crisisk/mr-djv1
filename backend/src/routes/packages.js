const express = require('express');
const { getPackages, resetCache } = require('../services/packageService');

const router = express.Router();
const mutationMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

router.use((req, res, next) => {
  if (mutationMethods.has(req.method)) {
    res.on('finish', () => {
      if (res.statusCode && res.statusCode < 400) {
        resetCache();
      }
    });
  }
  next();
});

router.get('/', async (_req, res, next) => {
  try {
    const result = await getPackages();
    res.json({
      packages: result.packages,
      source: result.source,
      cacheStatus: result.cacheStatus
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
