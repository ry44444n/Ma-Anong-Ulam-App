import fetch from 'node-fetch'; // Use import instead of require

export const searchUsersByRecipeTerm = async (searchTerm) => {
    try {
        // Fetch recipes that contain the searchTerm
        const response = await fetch(`http://localhost:5000/api/recipes/search?query=${searchTerm}`);
        const recipes = await response.json();

        // Extract unique user IDs or user information
        const userIds = [...new Set(recipes.map(recipe => recipe.userId))];

        // Fetch user details based on the extracted user IDs
        const usersResponse = await fetch(`http://localhost:5000/api/users?ids=${userIds.join(',')}`);
        const users = await usersResponse.json();

        return users; // This will give you the users who created the recipes
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Error fetching users');
    }
};
