import { body, validationResult } from 'express-validator';

const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

export const cartItemsValidator = [
  body('items')
    .isArray().withMessage('Items must be an array list'),
  body('items.*.product')
    .isMongoId().withMessage('Each item must contain a valid product ID'),
  body('items.*.variantSku')
    .trim()
    .notEmpty().withMessage('Each item must specify a variantSku'),
  body('items.*.quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be an integer of at least 1'),
  validateResults
];
