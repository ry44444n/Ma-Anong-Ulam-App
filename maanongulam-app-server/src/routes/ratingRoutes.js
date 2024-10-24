import express from 'express';
import {
  createRating,
  getRatingsByRecipe,
  updateRating,
  deleteRating,
  getLikesByRecipe,
  toggleLike // Import the toggleLike function
} from '../controllers/ratingController.js';

const router = express.Router();

// Create a new rating
router.post('/', createRating);

// Get ratings for a specific recipe
router.get('/recipeId/:recipeId', getRatingsByRecipe);

// Get the number of likes for a specific recipe
router.get('/likes/:recipeId', getLikesByRecipe);

// Update a rating by ratingId
router.put('/ratingId/:ratingId', updateRating);

// Delete a rating by ratingId
router.delete('/ratingId/:ratingId', deleteRating);

// Toggle like/unlike
router.post('/recipes/:recipeId/like', toggleLike); 

export default router;