const express = require('express');
const { getSupportConfiguration } = require('../services/supportConfigService');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const localeParam = Array.isArray(req.query.locale) ? req.query.locale[0] : req.query.locale;
    const result = await getSupportConfiguration(localeParam);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
