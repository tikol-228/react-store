import { body, validationResult } from 'express-validator';
import { Product } from '../models/Product.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// Validation rules
export const validateProduct = [
  body('name').trim().isLength({ min: 1 }),
  body('description').optional({ nullable: true }).trim(),
  body('price').isFloat({ min: 0 }),
  body('stock_quantity').isInt({ min: 0 }),
];

// Get all products
export const getProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category_id, search } = req.query;

  const offset = (page - 1) * limit;
  const filters = { category_id, search, limit: parseInt(limit), offset: parseInt(offset) };

  const products = await Product.findAll(filters);
  const total = await Product.getCount({ category_id, search });

  res.json({
    products,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// Get single product
export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  res.json({ product });
});

// Create product (admin only)
export const createProduct = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.details = errors.array();
    throw error;
  }

  const product = await Product.create({
    ...req.body,
    description: req.body.description?.trim() ?? '',
  });

  res.status(201).json({
    message: 'Product created successfully',
    product
  });
});

// Update product (admin only)
export const updateProduct = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.details = errors.array();
    throw error;
  }

  const { id } = req.params;
  const product = await Product.update(id, req.body);

  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  res.json({
    message: 'Product updated successfully',
    product
  });
});

// Delete product (admin only)
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  await Product.delete(id);

  res.json({ message: 'Product deleted successfully' });
});