import express from 'express';
import { body } from 'express-validator';
import {
  getDashboardStats,
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  createAdminOrder,
  getPanelAuthStatus,
  verifyPanelPin,
} from '../controllers/adminController.js';
import { validateOrder } from '../controllers/orderController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/panel-auth', authenticate, requireAdmin, getPanelAuthStatus);
router.post('/panel-auth', authenticate, requireAdmin, verifyPanelPin);

// All admin routes require admin authentication
router.get('/dashboard', authenticate, requireAdmin, getDashboardStats);
router.get('/notifications', authenticate, requireAdmin, getNotifications);
router.patch('/notifications/:id/read', authenticate, requireAdmin, markNotificationAsRead);
router.delete('/notifications/:id', authenticate, requireAdmin, deleteNotification);

router.post(
  '/orders',
  authenticate,
  requireAdmin,
  [...validateOrder, body('user_id').optional({ nullable: true }).isInt({ min: 1 })],
  createAdminOrder
);

export default router;