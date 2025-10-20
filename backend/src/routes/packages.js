const express = require('express');
const { getPackages } = require('../services/packageService');
const { createResponse } = require('../lib/response');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const result = await getPackages();
    const data = {
      packages: result.packages
    };
    const meta = {
      source: result.source,
      cacheStatus: result.cacheStatus
    };

    res.json(createResponse(data, meta));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
