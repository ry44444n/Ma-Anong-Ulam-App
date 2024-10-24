import userRoutes from './userRoutes.js';
import recipeRoutes from './recipeRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import commentRoutes from './commentRoutes.js';  
import ratingRoutes from './ratingRoutes.js';  
import favoriteRoutes from './favoriteRoutes.js';  

const setupRoutes = (app) => {
    app.use('/api/users', userRoutes);
    app.use('/api/recipes', recipeRoutes);
    app.use('/api/categories', categoryRoutes);
    app.use('/api/comments', commentRoutes);  
    app.use('/api/ratings', ratingRoutes);  
    app.use('/api/favorites', favoriteRoutes); 
};

export default setupRoutes;
