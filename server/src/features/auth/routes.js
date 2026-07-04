import express from 'express';
import authController from './controller.js';
import { authLimiter, passwordResetLimiter } from '../../middleware/rate-limiter.js';
import { protect } from '../../middleware/auth.middleware.js';
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator
} from './validation.js';

const router = express.Router();

// Apply auth rate limiting to registration and login
router.post('/register', authLimiter, registerValidator, (req, res, next) => authController.register(req, res, next));
router.post('/login', authLimiter, loginValidator, (req, res, next) => authController.login(req, res, next));
router.post('/logout', (req, res, next) => authController.logout(req, res, next));
router.post('/refresh', (req, res, next) => authController.refresh(req, res, next));
router.post('/verify-email', (req, res, next) => authController.verifyEmail(req, res, next));

// Password resets
router.post('/forgot-password', passwordResetLimiter, forgotPasswordValidator, (req, res, next) => authController.forgotPassword(req, res, next));
router.post('/reset-password', passwordResetLimiter, resetPasswordValidator, (req, res, next) => authController.resetPassword(req, res, next));

// Private profile actions
router.get('/profile', protect, (req, res, next) => authController.getProfile(req, res, next));
router.put('/change-password', protect, changePasswordValidator, (req, res, next) => authController.changePassword(req, res, next));

export default router;
