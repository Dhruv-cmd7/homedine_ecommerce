import { body, query, param, validationResult } from 'express-validator';

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

export const productValidator = [
  body('sku')
    .trim()
    .notEmpty().withMessage('Product SKU is required'),
  body('title')
    .trim()
    .notEmpty().withMessage('Product title is required')
    .isLength({ max: 120 }).withMessage('Title cannot exceed 120 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Product description is required'),
  body('category')
    .isMongoId().withMessage('Invalid category database identifier'),
  body('brand')
    .isMongoId().withMessage('Invalid brand database identifier'),
  body('price')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('compareAtPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Compare price must be a positive number'),
  validateResults
];

export const categoryValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ max: 50 }).withMessage('Category name cannot exceed 50 characters'),
  validateResults
];

export const brandValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Brand name is required')
    .isLength({ max: 50 }).withMessage('Brand name cannot exceed 50 characters'),
  validateResults
];

export const queryValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page number must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Minimum price must be positive'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Maximum price must be positive'),
  validateResults
];
