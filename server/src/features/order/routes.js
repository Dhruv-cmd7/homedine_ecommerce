import express from 'express';
import orderController from './controller.js';
import { protect, requireRole } from '../../middleware/auth.middleware.js';
import { checkoutValidator } from './validation.js';

const router = express.Router();

router.use(protect);

router.post('/checkout', checkoutValidator, (req, res, next) => orderController.checkout(req, res, next));
router.get('/my-orders', (req, res, next) => orderController.getMyOrders(req, res, next));
router.get('/admin/analytics', requireRole(['admin']), (req, res, next) => orderController.getAdminAnalytics(req, res, next));
router.get('/:id', (req, res, next) => orderController.getOrderDetails(req, res, next));

export default router;
