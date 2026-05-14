import { User } from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// Get all users (admin only)
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll();
  res.json({ users });
});

// Get user by ID (admin or self)
export const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if user can access this profile
  if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
    const error = new Error('Access denied');
    error.statusCode = 403;
    throw error;
  }

  res.json({ user });
});

// Update user (admin or self)
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, phone } = req.body;

  // Check if user can update this profile
  if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
    const error = new Error('Access denied');
    error.statusCode = 403;
    throw error;
  }

  const user = await User.update(id, { first_name, last_name, phone });
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  res.json({
    message: 'User updated successfully',
    user
  });
});

// Delete user (admin only)
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  // Prevent deleting admin users
  if (user.role === 'admin') {
    const error = new Error('Cannot delete admin user');
    error.statusCode = 403;
    throw error;
  }

  await User.delete(id);

  res.json({ message: 'User deleted successfully' });
});