const express = require('express');
const { getApprovedReviews } = require('../services/reviewService');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const result = await getApprovedReviews();
    res.json({
      reviews: result.reviews,
      source: result.source,
      cacheStatus: result.cacheStatus
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
