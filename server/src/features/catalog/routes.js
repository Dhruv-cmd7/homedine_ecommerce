import express from 'express';
import catalogController from './controller.js';
import { protect, requireRole } from '../../middleware/auth.middleware.js';
import {
  productValidator,
  categoryValidator,
  brandValidator,
  queryValidator
} from './validation.js';

const router = express.Router();

// Public Routes
router.get('/categories', (req, res, next) => catalogController.getCategories(req, res, next));
router.get('/brands', (req, res, next) => catalogController.getBrands(req, res, next));
router.get('/products', queryValidator, (req, res, next) => catalogController.getProducts(req, res, next));
router.get('/products/:id', (req, res, next) => catalogController.getProductById(req, res, next));

// Admin Protected Routes (CRUD)
router.post('/admin/categories', protect, requireRole(['admin']), categoryValidator, (req, res, next) => catalogController.adminCreateCategory(req, res, next));
router.post('/admin/brands', protect, requireRole(['admin']), brandValidator, (req, res, next) => catalogController.adminCreateBrand(req, res, next));
router.post('/admin/products', protect, requireRole(['admin']), productValidator, (req, res, next) => catalogController.adminCreateProduct(req, res, next));
router.put('/admin/products/:id', protect, requireRole(['admin']), productValidator, (req, res, next) => catalogController.adminUpdateProduct(req, res, next));
router.delete('/admin/products/:id', protect, requireRole(['admin']), (req, res, next) => catalogController.adminDeleteProduct(req, res, next));

export default router;
