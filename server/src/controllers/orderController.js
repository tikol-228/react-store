import { body, validationResult } from 'express-validator';
import { Order } from '../models/Order.js';
import { Cart } from '../models/Cart.js';
import { AdminNotification } from '../models/AdminNotification.js';
import { Product } from '../models/Product.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// Validation rules
export const validateOrder = [
  body('customer_name').trim().isLength({ min: 1 }),
  body('customer_email').isEmail().normalizeEmail(),
  body('customer_phone').trim().isLength({ min: 1 }),
  body('shipping_address').trim().isLength({ min: 1 }),
  body('items').isArray({ min: 1 }),
  body('items.*.product_id').isInt({ min: 1 }),
  body('items.*.quantity').isInt({ min: 1 }),
  body('items.*.price').optional().isFloat({ min: 0 }),
];

// Create order
export const createOrder = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.details = errors.array();
    throw error;
  }

  const { customer_name, customer_email, customer_phone, shipping_address, comment, items } = req.body;
  const user_id = req.user ? Number(req.user.id) : null;

  const normalizedItems = [];
  for (const item of items) {
    const product = await Product.findById(item.product_id);
    if (!product || !product.is_active) {
      const error = new Error(`Product unavailable: ${item.product_id}`);
      error.statusCode = 400;
      throw error;
    }
    if (product.stock_quantity < item.quantity) {
      const error = new Error(`Insufficient stock for "${product.name}"`);
      error.statusCode = 400;
      throw error;
    }
    normalizedItems.push({
      product_id: item.product_id,
      quantity: item.quantity,
      price: product.price,
    });
  }

  const total_amount = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await Order.create({
    user_id,
    customer_name,
    customer_email,
    customer_phone,
    shipping_address,
    total_amount,
    comment,
    items: normalizedItems,
  });

  // Clear cart if user was logged in
  if (user_id) {
    await Cart.clearCart(user_id);
  }

  // Create admin notification
  await AdminNotification.newOrder(order.id);

  res.status(201).json({
    message: 'Order created successfully',
    order
  });
});

// Get all orders (admin) or user orders
export const getOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const offset = (page - 1) * limit;

  let filters = { limit: parseInt(limit), offset: parseInt(offset) };

  if (req.user.role !== 'admin') {
    filters.user_id = req.user.id;
  }

  if (status) {
    filters.status = status;
  }

  const orders = await Order.findAll(filters);
  const total = await Order.getCount(filters);

  res.json({
    orders,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// Get single order
export const getOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id);
  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }

  if (req.user.role !== 'admin' && Number(order.user_id) !== Number(req.user.id)) {
    const error = new Error('Access denied');
    error.statusCode = 403;
    throw error;
  }

  res.json({ order });
});

// Update order status (admin only)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
    const error = new Error('Invalid status');
    error.statusCode = 400;
    throw error;
  }

  const order = await Order.updateStatus(id, status);
  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }

  res.json({
    message: 'Order status updated successfully',
    order
  });
});

// Delete order (admin only)
export const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id);
  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }

  await Order.delete(id);

  res.json({ message: 'Order deleted successfully' });
});