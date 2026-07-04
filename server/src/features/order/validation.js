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

export const checkoutValidator = [
  body('items')
    .isArray({ min: 1 }).withMessage('Items must be a non-empty array list'),
  body('items.*.productId')
    .isMongoId().withMessage('Each item must contain a valid product ID'),
  body('items.*.variantSku')
    .trim()
    .notEmpty().withMessage('Each item must specify a variantSku'),
  body('items.*.quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be an integer of at least 1'),
  body('shippingAddress')
    .isObject().withMessage('shippingAddress is required'),
  body('shippingAddress.recipient')
    .trim()
    .notEmpty().withMessage('Recipient name is required'),
  body('shippingAddress.street')
    .trim()
    .notEmpty().withMessage('Street address is required'),
  body('shippingAddress.city')
    .trim()
    .notEmpty().withMessage('City is required'),
  body('shippingAddress.state')
    .trim()
    .notEmpty().withMessage('State/province is required'),
  body('shippingAddress.zip')
    .trim()
    .notEmpty().withMessage('ZIP/postal code is required'),
  body('shippingAddress.country')
    .trim()
    .notEmpty().withMessage('Country is required'),
  validateResults
];
