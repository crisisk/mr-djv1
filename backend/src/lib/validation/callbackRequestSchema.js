const { body } = require('express-validator');

const callbackRequestSchema = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Naam is vereist')
    .isLength({ min: 2, max: 255 })
    .withMessage('Naam moet tussen 2 en 255 karakters zijn'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Telefoonnummer is vereist')
    .matches(/^[0-9+\s()-]{6,}$/)
    .withMessage('Ongeldig telefoonnummer'),
  body('eventType')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Type evenement is ongeldig')
    .bail()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Type evenement is te lang')
];

module.exports = { callbackRequestSchema };
