const Joi = require('joi');

const bookingSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      'any.required': 'Naam is vereist',
      'string.empty': 'Naam is vereist'
    }),
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'any.required': 'Ongeldig e-mailadres',
      'string.email': 'Ongeldig e-mailadres',
      'string.empty': 'Ongeldig e-mailadres'
    }),
  phone: Joi.string()
    .trim()
    .min(6)
    .required()
    .messages({
      'any.required': 'Telefoonnummer is vereist',
      'string.empty': 'Telefoonnummer is vereist',
      'string.min': 'Telefoonnummer is vereist'
    }),
  eventType: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      'any.required': 'Type evenement is vereist',
      'string.empty': 'Type evenement is vereist'
    }),
  eventDate: Joi.string()
    .trim()
    .isoDate()
    .optional()
    .allow('', null)
    .messages({
      'string.isoDate': 'Ongeldige datum'
    }),
  message: Joi.string()
    .trim()
    .max(4000)
    .optional()
    .allow('', null)
    .messages({
      'string.max': 'Bericht is te lang'
    }),
  packageId: Joi.string()
    .trim()
    .max(255)
    .optional()
    .allow('', null)
}).prefs({ abortEarly: false, stripUnknown: true });

function validateBooking(payload) {
  const { error, value } = bookingSchema.validate(payload);

  if (!error) {
    const sanitized = { ...value };

    if (sanitized.eventDate === '' || sanitized.eventDate === null) {
      sanitized.eventDate = undefined;
    }

    if (sanitized.message === '' || sanitized.message === null) {
      sanitized.message = undefined;
    }

    if (sanitized.packageId === '' || sanitized.packageId === null) {
      sanitized.packageId = undefined;
    }

    return { value: sanitized };
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
  bookingSchema,
  validateBooking
};
