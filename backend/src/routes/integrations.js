const express = require('express');
const rentGuyService = require('../services/rentGuyService');
const hubspotService = require('../services/hubspotService');

const router = express.Router();

router.get('/rentguy/status', (_req, res) => {
  res.json(rentGuyService.getStatus());
});

router.get('/hubspot/status', (_req, res) => {
  res.json(hubspotService.getStatus());
});

module.exports = router;
