import { AdminNotification } from '../models/AdminNotification.js';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Contact } from '../models/Contact.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validationResult } from 'express-validator';

// Get dashboard stats
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalOrders, totalUsers, totalProducts, unreadContacts, unreadNotifications] = await Promise.all([
    Order.getCount({}),
    User.findAll().then(users => users.length),
    Product.getCount({}),
    Contact.getUnreadCount(),
    AdminNotification.getUnreadCount()
  ]);

  // Get recent orders
  const recentOrders = await Order.findAll({ limit: 5, offset: 0 });

  // Get recent notifications
  const recentNotifications = await AdminNotification.findAll();

  res.json({
    stats: {
      totalOrders,
      totalUsers,
      totalProducts,
      unreadContacts,
      unreadNotifications
    },
    recentOrders,
    recentNotifications: recentNotifications.slice(0, 10)
  });
});

// Get all notifications
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await AdminNotification.findAll();
  const unreadCount = await AdminNotification.getUnreadCount();

  res.json({ notifications, unreadCount });
});

// Mark notification as read
export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await AdminNotification.markAsRead(id);
  if (!notification) {
    const error = new Error('Notification not found');
    error.statusCode = 404;
    throw error;
  }

  res.json({
    message: 'Notification marked as read',
    notification
  });
});

// Delete notification
export const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notifications = await AdminNotification.findAll();
  const existingNotification = notifications.find(n => n.id === parseInt(id));

  if (!existingNotification) {
    const error = new Error('Notification not found');
    error.statusCode = 404;
    throw error;
  }

  await AdminNotification.delete(id);

  res.json({ message: 'Notification deleted successfully' });
});

// Create order from admin panel (phone / in-store orders, etc.)
export const createAdminOrder = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.details = errors.array();
    throw error;
  }

  const { customer_name, customer_email, customer_phone, shipping_address, comment, items, user_id } = req.body;

  let targetUserId = null;
  if (user_id !== undefined && user_id !== null && user_id !== '') {
    targetUserId = parseInt(String(user_id), 10);
    const linkedUser = await User.findById(targetUserId);
    if (!linkedUser) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
  }

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

  const total_amount = normalizedItems.reduce((sum, it) => sum + it.price * it.quantity, 0);

  const order = await Order.create({
    user_id: targetUserId,
    customer_name,
    customer_email,
    customer_phone,
    shipping_address,
    total_amount,
    comment: comment ?? null,
    items: normalizedItems,
  });

  await AdminNotification.newOrder(order.id);

  res.status(201).json({
    message: 'Order created successfully',
    order,
  });
});

// Доп. PIN для входа в UI панели (после JWT-роли admin). Если ADMIN_PANEL_PIN не задан — шаг отключён.
export const getPanelAuthStatus = asyncHandler(async (req, res) => {
  const pin = process.env.ADMIN_PANEL_PIN;
  const pinRequired = typeof pin === 'string' && pin.length > 0;
  res.json({ pinRequired });
});

export const verifyPanelPin = asyncHandler(async (req, res) => {
  const expected = process.env.ADMIN_PANEL_PIN;
  if (!expected) {
    return res.json({ ok: true, skipped: true });
  }
  const { pin } = req.body || {};
  if (typeof pin !== 'string' || pin !== expected) {
    const error = new Error('Неверный PIN панели');
    error.statusCode = 403;
    throw error;
  }
  res.json({ ok: true });
});