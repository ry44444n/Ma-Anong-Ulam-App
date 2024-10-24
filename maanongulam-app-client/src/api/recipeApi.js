// src/api/recipeApi.js

// Create a new recipe
export const createRecipe = async (formData) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/recipes`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Failed to create recipe');
    }
    return await response.json();
  } catch (error) {
    console.error('Error submitting recipe:', error);
    throw error;
  }
};

// Search for recipes
export const searchRecipes = async (searchTerm) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/recipes/search?query=${searchTerm}`);
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

// Fetch recipes by category ID
export const fetchRecipesByCategory = async (categoryId) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/recipes/category/${categoryId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching recipes by category:', error);
    throw error;
  }
};

// Fetch a random recipe
export const fetchRandomRecipe = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/recipes/random`);
    if (!response.ok) {
      throw new Error('Failed to fetch random recipe');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching random recipe:', error);
    throw error;
  }
};

// Fetch recipe details
export const fetchRecipeDetails = async (recipeId) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/recipes/${recipeId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch recipe details');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    throw error;
  }
};

// Update a recipe
export const updateRecipe = async (recipeId, updatedData) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/recipes/${recipeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
      throw new Error('Failed to update recipe');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw error;
  }
};

// Delete a recipe
export const deleteRecipe = async (recipeId) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/recipes/${recipeId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete recipe');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw error;
  }
};
