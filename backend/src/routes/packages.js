const express = require('express');
const { getPackages } = require('../services/packageService');

const router = express.Router();

router.get('/', (_req, res) => {
  res.json({
    packages: getPackages()
  });
});

module.exports = router;
