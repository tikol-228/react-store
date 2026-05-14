import { body, validationResult } from 'express-validator';
import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// Validation rules
export const validateCartItem = [
  body('product_id').isInt({ min: 1 }),
  body('quantity').isInt({ min: 1 }),
];

// Get user's cart
export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.getUserCart(req.user.id);
  const total = await Cart.getCartTotal(req.user.id);

  res.json({ cart, total });
});

// Add item to cart
export const addToCart = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.details = errors.array();
    throw error;
  }

  const { product_id, quantity } = req.body;

  // Check if product exists and is active
  const product = await Product.findById(product_id);
  if (!product || !product.is_active) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  // Check stock
  if (product.stock_quantity < quantity) {
    const error = new Error('Insufficient stock');
    error.statusCode = 400;
    throw error;
  }

  const cart = await Cart.addItem(req.user.id, product_id, quantity);
  const total = await Cart.getCartTotal(req.user.id);

  res.json({
    message: 'Item added to cart',
    cart,
    total
  });
});

// Update cart item
export const updateCartItem = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.details = errors.array();
    throw error;
  }

  const { product_id, quantity } = req.body;

  // Check if product exists and is active
  const product = await Product.findById(product_id);
  if (!product || !product.is_active) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  // Check stock
  if (product.stock_quantity < quantity) {
    const error = new Error('Insufficient stock');
    error.statusCode = 400;
    throw error;
  }

  const cart = await Cart.updateItem(req.user.id, product_id, quantity);
  const total = await Cart.getCartTotal(req.user.id);

  res.json({
    message: 'Cart item updated',
    cart,
    total
  });
});

// Remove item from cart
export const removeFromCart = asyncHandler(async (req, res) => {
  const { product_id } = req.params;

  const cart = await Cart.removeItem(req.user.id, product_id);
  const total = await Cart.getCartTotal(req.user.id);

  res.json({
    message: 'Item removed from cart',
    cart,
    total
  });
});

// Clear cart
export const clearCart = asyncHandler(async (req, res) => {
  await Cart.clearCart(req.user.id);

  res.json({ message: 'Cart cleared' });
});