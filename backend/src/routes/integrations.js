const express = require('express');
const rentGuyService = require('../services/rentGuyService');
const sevensaService = require('../services/sevensaService');

const router = express.Router();

router.get('/rentguy/status', async (_req, res, next) => {
  try {
    const status = await rentGuyService.getStatus();
    res.json(status);
  } catch (error) {
    next(error);
  }
});

router.get('/sevensa/status', async (_req, res, next) => {
  try {
    const status = await sevensaService.getStatus();
    res.json(status);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
