import express from 'express';
import {
  getProductReviews,
  getUserReviews,
  createReview,
  updateReview,
  deleteReview,
  validateReview
} from '../controllers/reviewController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/product/:product_id', getProductReviews);

// Authenticated routes
router.get('/user', authenticate, getUserReviews);
router.post('/', authenticate, validateReview, createReview);
router.put('/:id', authenticate, validateReview, updateReview);
router.delete('/:id', authenticate, deleteReview);

export default router;