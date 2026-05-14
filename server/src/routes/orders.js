import express from 'express';
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
  validateOrder
} from '../controllers/orderController.js';
import { authenticate, optionalAuthenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Guest or logged-in checkout: optional JWT links order to user when valid
router.post('/', optionalAuthenticate, validateOrder, createOrder);

// Authenticated routes
router.get('/', authenticate, getOrders);
router.get('/:id', authenticate, getOrder);

// Admin routes
router.patch('/:id/status', authenticate, requireAdmin, updateOrderStatus);
router.delete('/:id', authenticate, requireAdmin, deleteOrder);

export default router;