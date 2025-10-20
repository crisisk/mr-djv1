const express = require('express');
const { validateFeedback } = require('../lib/validation/feedbackSchema');
const { submitSurveyResponse } = require('../services/surveyService');

const router = express.Router();

router.post('/', async (req, res, next) => {
  const validation = validateFeedback(req.body);

  if (validation.error) {
    return res.status(422).json({
      error: 'Validatie mislukt',
      details: validation.details
    });
  }

  try {
    const result = await submitSurveyResponse(validation.value);
    return res.status(201).json({
      status: 'received',
      survey: {
        id: result.id,
        status: result.status,
        submittedAt: result.submittedAt,
        approved: result.approved
      }
    });
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({
        error: 'Survey niet gevonden of al gebruikt'
      });
    }
    return next(error);
  }
});

module.exports = router;
