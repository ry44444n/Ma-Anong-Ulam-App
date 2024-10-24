import express from 'express';
import { 
    registerUser, 
    loginUser, 
    updateUser, 
    deleteUser, 
    getUserByUsername, 
    deactivateUser, 
    getUserById // Import the new function
} from '../controllers/userController.js';

const router = express.Router();

// User registration and login routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/:userId', updateUser); // Update user
router.delete('/:userId', deleteUser); // Soft delete user
router.put('/deactivate/:userId', deactivateUser); // Deactivate user
router.get('/:username', getUserByUsername); // Get user by username
router.get('/user/:userId', getUserById); // New route to get user by userId

export default router;
