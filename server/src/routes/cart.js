import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  validateCartItem
} from '../controllers/cartController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All cart routes require authentication
router.get('/', authenticate, getCart);
router.post('/', authenticate, validateCartItem, addToCart);
router.put('/', authenticate, validateCartItem, updateCartItem);
router.delete('/item/:product_id', authenticate, removeFromCart);
router.delete('/', authenticate, clearCart);

export default router;