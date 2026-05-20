import { body, validationResult } from 'express-validator';
import { Category } from '../models/Category.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { isAllowedCategoryName } from '../constants/storeCategories.js';
import { isAllowedBrandName } from '../constants/storeBrands.js';

// Validation rules
export const validateCategory = [
  body('name').trim().isLength({ min: 1 }),
  body('description').trim().optional(),
];

// Get all categories
export const getCategories = asyncHandler(async (req, res) => {
  const all = await Category.findAll();
  const byName = new Map();
  for (const c of all) {
    if (!isAllowedCategoryName(c.name)) continue;
    if (!byName.has(c.name)) byName.set(c.name, c);
  }
  const categories = [...byName.values()].sort((a, b) =>
    a.name.localeCompare(b.name, 'ru')
  );
  res.json({ categories });
});

// Get brand categories (stored as categories in DB)
export const getBrands = asyncHandler(async (req, res) => {
  const all = await Category.findAll();
  const byName = new Map();
  for (const c of all) {
    if (!isAllowedBrandName(c.name)) continue;
    if (!byName.has(c.name)) byName.set(c.name, c);
  }
  const brands = [...byName.values()].sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  res.json({ brands });
});

// Get single category
export const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  res.json({ category });
});

// Create category (admin only)
export const createCategory = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.details = errors.array();
    throw error;
  }

  const category = await Category.create(req.body);

  res.status(201).json({
    message: 'Category created successfully',
    category
  });
});

// Update category (admin only)
export const updateCategory = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.details = errors.array();
    throw error;
  }

  const { id } = req.params;
  const category = await Category.update(id, req.body);

  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  res.json({
    message: 'Category updated successfully',
    category
  });
});

// Delete category (admin only)
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  await Category.delete(id);

  res.json({ message: 'Category deleted successfully' });
});