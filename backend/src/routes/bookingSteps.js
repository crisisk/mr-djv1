const express = require('express');
const { validateStepPayload, persistStepProgress, getFlowProgress } = require('../services/bookingStepService');

const router = express.Router();

router.post('/validate', async (req, res, next) => {
  try {
    const { flowId, stepId, payload = {} } = req.body || {};

    if (!flowId || typeof flowId !== 'string' || !flowId.trim()) {
      return res.status(400).json({
        error: 'FlowId ontbreekt of is ongeldig.'
      });
    }

    if (!stepId || typeof stepId !== 'string' || !stepId.trim()) {
      return res.status(400).json({
        error: 'StepId ontbreekt of is ongeldig.'
      });
    }

    const validation = validateStepPayload(stepId.trim(), payload);

    if (!validation.valid) {
      return res.status(422).json({
        error: 'Validatie mislukt',
        details: validation.errors
      });
    }

    const persistResult = await persistStepProgress(flowId.trim(), stepId.trim(), validation.normalizedPayload, {
      isComplete: true
    });
    const progress = await getFlowProgress(flowId.trim());

    return res.json({
      success: true,
      flowId: flowId.trim(),
      stepId: stepId.trim(),
      persisted: persistResult.persisted,
      progress
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
