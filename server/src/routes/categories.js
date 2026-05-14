import express from 'express';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  validateCategory
} from '../controllers/categoryController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategory);

// Admin routes
router.post('/', authenticate, requireAdmin, validateCategory, createCategory);
router.put('/:id', authenticate, requireAdmin, validateCategory, updateCategory);
router.delete('/:id', authenticate, requireAdmin, deleteCategory);

export default router;