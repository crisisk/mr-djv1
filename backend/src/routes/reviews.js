const express = require('express');
const { getApprovedReviews } = require('../services/reviewService');
const { createResponse } = require('../lib/response');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const result = await getApprovedReviews();
    const data = {
      reviews: result.reviews
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
