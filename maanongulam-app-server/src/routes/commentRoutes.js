import express from 'express';
import {createComment, getCommentsByRecipe, updateComment, deleteComment} from '../controllers/commentController.js';

const router = express.Router();

// Create a new comment
router.post('/', createComment);

// Get comments for a specific recipe
router.get('/recipeId/:recipeId', getCommentsByRecipe);

// Update a comment by commentId
router.put('/:id', updateComment); 

// Delete a comment by commentId
router.delete('/:id', deleteComment); 

export default router;