import express from 'express';
import upload from '../middlewares/upload.js';
import { 
  createRecipe, 
  getAllRecipes, 
  getRecipeById, 
  updateRecipe, 
  deleteRecipe, 
  searchRecipes,
  fetchAndSaveRecipesByCategory, 
  getRecipesByCategoryId,
  getRandomRecipes,
  getRecipesByUserId // Import the new function here
} from '../controllers/recipeController.js';

const router = express.Router();

// GET /recipes/random - Get 10 random recipes
router.get('/random', getRandomRecipes);

// GET /recipes/user/:userId - Get recipes by user ID
router.get('/user/:userId', getRecipesByUserId); // Add new route

// Route for creating a recipe with image upload
router.post('/', upload.single('image'), createRecipe);

// GET /recipes - Get all recipes
router.get('/', getAllRecipes);

// GET /recipes/search - Search for recipes
router.get('/search', searchRecipes); 

// GET /recipes/:recipeId - Get a recipe by ID
router.get('/:recipeId', getRecipeById);

// GET /recipes/category/:categoryId - Get recipes by category ID
router.get('/category/:categoryId', getRecipesByCategoryId);

// Route for updating a recipe with image upload
router.put('/:recipeId', upload.single('image'), updateRecipe);

// DELETE /recipes/:recipeId - Delete a recipe
router.delete('/:recipeId', deleteRecipe);

// Utility Route for fetching and saving recipes by category
router.post('/fetch-and-save/userId/:userId/categoryId/:categoryId/categoryName/:categoryName', fetchAndSaveRecipesByCategory);

export default router;
