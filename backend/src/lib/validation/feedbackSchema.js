const Joi = require('joi');

const feedbackSchema = Joi.object({
  token: Joi.string()
    .trim()
    .min(16)
    .max(128)
    .required()
    .messages({
      'any.required': 'Survey token is vereist',
      'string.empty': 'Survey token is vereist'
    }),
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      'any.required': 'Geef een beoordeling tussen 1 en 5',
      'number.base': 'Geef een beoordeling tussen 1 en 5',
      'number.min': 'Geef een beoordeling tussen 1 en 5',
      'number.max': 'Geef een beoordeling tussen 1 en 5'
    }),
  reviewText: Joi.string()
    .trim()
    .max(4000)
    .optional()
    .allow('', null)
    .messages({
      'string.max': 'Feedback is te lang'
    }),
  name: Joi.string()
    .trim()
    .max(255)
    .optional()
    .allow('', null),
  eventType: Joi.string()
    .trim()
    .max(100)
    .optional()
    .allow('', null),
  eventDate: Joi.string()
    .trim()
    .isoDate()
    .optional()
    .allow('', null)
    .messages({
      'string.isoDate': 'Ongeldige datum'
    }),
  packageId: Joi.string()
    .trim()
    .max(50)
    .optional()
    .allow('', null),
  wouldRecommend: Joi.boolean()
    .optional()
}).prefs({ abortEarly: false, stripUnknown: true });

function sanitizeOptional(value) {
  if (value === '' || value === null) {
    return undefined;
  }
  return value;
}

function validateFeedback(payload) {
  const { error, value } = feedbackSchema.validate(payload);

  if (!error) {
    return {
      value: {
        token: value.token,
        rating: value.rating,
        reviewText: sanitizeOptional(value.reviewText),
        name: sanitizeOptional(value.name),
        eventType: sanitizeOptional(value.eventType),
        eventDate: sanitizeOptional(value.eventDate),
        packageId: sanitizeOptional(value.packageId),
        wouldRecommend: typeof value.wouldRecommend === 'boolean' ? value.wouldRecommend : undefined
      }
    };
  }

  return {
    error,
    details: error.details.map((detail) => ({
      field: detail.path.join('.') || detail.context.key,
      message: detail.message
    }))
  };
}

module.exports = {
  feedbackSchema,
  validateFeedback
};
