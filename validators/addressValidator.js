import { body } from 'express-validator';

export const addressValidation = [
  body('addressLine1').notEmpty().withMessage('Address line 1 is required').trim(),
  body('city').notEmpty().withMessage('City is required').trim(),
  body('state').notEmpty().withMessage('State is required').trim(),
  body('postalCode').isNumeric().withMessage('Postal code must be a number').isLength({ min: 5, max: 6 }),
];

