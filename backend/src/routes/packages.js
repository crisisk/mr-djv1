const express = require('express');
const { getPackages } = require('../services/packageService');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const result = await getPackages();
    res.json({
      packages: result.packages,
      source: result.source
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
