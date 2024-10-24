// src/components/RecipeGrid.jsx
import React, { useContext, useEffect } from 'react';
import RecipeCard from './RecipeCard';
import { RecipeContext } from '../context/RecipeContext';
import { fetchRecipesByCategory, fetchRandomRecipe } from '../api/recipeApi';

const RecipeGrid = ({ selectedCategoryId, onRecipeSelect }) => {
  const { recipes, setRecipes } = useContext(RecipeContext);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        let fetchedRecipes;
        if (selectedCategoryId) {
          // Fetch all recipes of the selected category
          fetchedRecipes = await fetchRecipesByCategory(selectedCategoryId);
        } else {
          // Fetch random recipes if no category is selected
          fetchedRecipes = await fetchRandomRecipe();
        }
        setRecipes(fetchedRecipes); // Set the fetched recipes directly without slicing
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setRecipes([]); // Reset recipes if there's an error
      }
    };

    fetchRecipes();
  }, [selectedCategoryId, setRecipes]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-orange-400 font-zina text-3xl font-bold mb-4">Featured Recipes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeCard key={recipe.recipeId} recipe={recipe} onClick={() => onRecipeSelect(recipe.recipeId)} />
          ))
        ) : (
          <p>No recipes available.</p>
        )}
      </div>
    </div>
  );
};

export default RecipeGrid;
