const Joi = require('joi');

const availabilitySchema = Joi.object({
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'any.required': 'E-mailadres is vereist',
      'string.email': 'Ongeldig e-mailadres',
      'string.empty': 'E-mailadres is vereist'
    }),
  eventDate: Joi.alternatives()
    .try(Joi.date().iso(), Joi.string().isoDate())
    .required()
    .messages({
      'any.required': 'Evenementdatum is vereist',
      'date.format': 'Ongeldige datum',
      'string.isoDate': 'Ongeldige datum'
    }),
  pageUri: Joi.string().uri({ allowRelative: false }).allow('', null),
  pageName: Joi.string().trim().max(200).allow('', null),
  message: Joi.string().trim().max(2000).allow('', null),
  marketingConsent: Joi.boolean().default(false),
  statisticsConsent: Joi.boolean().default(false)
}).prefs({ abortEarly: false, stripUnknown: true });

function normaliseValue(value) {
  const normalised = { ...value };

  // eventDate is already validated and normalized by Joi
  if (normalised.pageUri === '' || normalised.pageUri === null) {
    normalised.pageUri = undefined;
  }

  if (normalised.pageName === '' || normalised.pageName === null) {
    normalised.pageName = undefined;
  }

  if (normalised.message === '' || normalised.message === null) {
    normalised.message = undefined;
  }

  return normalised;
}

function validateAvailabilityRequest(payload) {
  const { error, value } = availabilitySchema.validate(payload);

  if (!error) {
    return { value: normaliseValue(value) };
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
  availabilitySchema,
  validateAvailabilityRequest
};
