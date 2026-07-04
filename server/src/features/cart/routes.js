import express from 'express';
import cartController from './controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { cartItemsValidator } from './validation.js';

const router = express.Router();

// All cart endpoints require user authentication
router.use(protect);

router.get('/', (req, res, next) => cartController.getCart(req, res, next));
router.put('/', cartItemsValidator, (req, res, next) => cartController.updateCart(req, res, next));
router.post('/merge', cartItemsValidator, (req, res, next) => cartController.mergeCart(req, res, next));

export default router;
