import express from 'express';
import authRoutes from './features/auth/routes.js';
import catalogRoutes from './features/catalog/routes.js';
import cartRoutes from './features/cart/routes.js';
import orderRoutes from './features/order/routes.js';

const router = express.Router();

// Mount Feature Routes
router.use('/auth', authRoutes);
router.use('/catalog', catalogRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);

export default router;
