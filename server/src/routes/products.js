import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  validateProduct
} from '../controllers/productController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Admin routes
router.post('/', authenticate, requireAdmin, validateProduct, createProduct);
router.put('/:id', authenticate, requireAdmin, validateProduct, updateProduct);
router.delete('/:id', authenticate, requireAdmin, deleteProduct);

export default router;