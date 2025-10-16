const express = require('express');
const rentGuyService = require('../services/rentGuyService');

const router = express.Router();

router.get('/rentguy/status', (_req, res) => {
  res.json(rentGuyService.getStatus());
});

module.exports = router;
