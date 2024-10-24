import express from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById,
  getCategoryByStrCategory, // New import
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';

const router = express.Router();

// Create a category
router.post('/', createCategory);

// Get all categories
router.get('/', getCategories);

// Get a category by ID
router.get('/:id', getCategoryById);

// Get a category by category name
router.get('/categoryName/:categoryName', getCategoryByStrCategory);

// Update a category
router.put('/:id', updateCategory);

// Delete a category
router.delete('/:id', deleteCategory);

export default router;
