import jwt from 'jsonwebtoken';
import { asyncHandler } from './errorHandler.js';

// Verify JWT token
export const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    const error = new Error('Access denied. No token provided.');
    error.statusCode = 401;
    throw error;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    const error = new Error('Invalid token.');
    error.statusCode = 401;
    throw error;
  }
});

// If Authorization Bearer is present and valid, sets req.user; otherwise continues as guest
export const optionalAuthenticate = asyncHandler(async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch {
    // ignore invalid/expired token for public checkout flows
  }
  next();
});

// Check if user is admin
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    const error = new Error('Access denied. Admin role required.');
    error.statusCode = 403;
    return next(error);
  }
  next();
};