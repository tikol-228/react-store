import { body, validationResult } from 'express-validator';
import { Review } from '../models/Review.js';
import { Product } from '../models/Product.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// Validation rules
export const validateReview = [
  body('product_id').isInt({ min: 1 }),
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').trim().optional(),
];

// Get reviews for a product
export const getProductReviews = asyncHandler(async (req, res) => {
  const { product_id } = req.params;

  // Check if product exists
  const product = await Product.findById(product_id);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  const reviews = await Review.findByProduct(product_id);
  const stats = await Review.getAverageRating(product_id);

  res.json({ reviews, stats });
});

// Get user's reviews
export const getUserReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.findByUser(req.user.id);
  res.json({ reviews });
});

// Create review
export const createReview = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.details = errors.array();
    throw error;
  }

  const { product_id, rating, comment } = req.body;

  // Check if product exists
  const product = await Product.findById(product_id);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if user already reviewed this product
  const existingReview = await Review.findByProduct(product_id);
  const userReview = existingReview.find(review => review.user_id === req.user.id);

  if (userReview) {
    const error = new Error('You have already reviewed this product');
    error.statusCode = 409;
    throw error;
  }

  const review = await Review.create({
    user_id: req.user.id,
    product_id,
    rating,
    comment
  });

  res.status(201).json({
    message: 'Review created successfully',
    review
  });
});

// Update review
export const updateReview = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.details = errors.array();
    throw error;
  }

  const { id } = req.params;
  const { rating, comment } = req.body;

  const review = await Review.findById(id);
  if (!review) {
    const error = new Error('Review not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if user owns this review
  if (review.user_id !== req.user.id) {
    const error = new Error('Access denied');
    error.statusCode = 403;
    throw error;
  }

  const updatedReview = await Review.update(id, { rating, comment });

  res.json({
    message: 'Review updated successfully',
    review: updatedReview
  });
});

// Delete review
export const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const review = await Review.findById(id);
  if (!review) {
    const error = new Error('Review not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if user owns this review or is admin
  if (review.user_id !== req.user.id && req.user.role !== 'admin') {
    const error = new Error('Access denied');
    error.statusCode = 403;
    throw error;
  }

  await Review.delete(id);

  res.json({ message: 'Review deleted successfully' });
});