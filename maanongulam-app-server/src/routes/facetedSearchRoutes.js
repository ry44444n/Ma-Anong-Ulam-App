// facetedSearchRoutes.js
import express from 'express';
import { searchUsersByRecipeTerm } from '../controllers/facetedSearchController.js';

const router = express.Router();

// Define the route for searching users by recipe term
router.get('/users', async (req, res) => {
    const { searchTerm } = req.query;
    if (!searchTerm) {
        return res.status(400).json({ error: 'Search term is required' });
    }
    
    try {
        const users = await searchUsersByRecipeTerm(searchTerm);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

export default router;
