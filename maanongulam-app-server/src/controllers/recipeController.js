import Recipe from '../models/Recipe.js';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { PassThrough } from 'stream';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Uploading an image
export const uploadImage = async (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'image' },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return reject(error);
                }
                resolve(result.secure_url);
            }
        );

        const bufferStream = new PassThrough();
        bufferStream.end(buffer);
        bufferStream.pipe(stream);
    });
};

// Create Recipe
export const createRecipe = async (req, res) => { 
    const { title, ingredients, instructions, categoryId, userId } = req.body;
    let imageUrl = null;

    try {
        if (req.file) {
            console.log('Uploaded file:', req.file);
            imageUrl = await uploadImage(req.file.buffer);
            console.log('Image URL:', imageUrl);
        }

        const recipe = new Recipe({
            title,
            ingredients,
            instructions,
            userId,
            categoryId,
            imageUrl,
        });

        console.log('Recipe object before saving:', recipe);
        await recipe.save();
        console.log('Recipe saved successfully:', recipe);
        res.status(201).json(recipe);
    } catch (error) {
        console.error('Error creating recipe:', error);
        res.status(500).json({ message: 'Error creating recipe', error: error.message });
    }
};

// Get All Recipes
export const getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({ isDeleted: false });
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recipes', error: error.message });
    }
};

// Get Recipe by recipeId
export const getRecipeById = async (req, res) => {
    const { recipeId } = req.params;

    try {
        const recipe = await Recipe.findOne({ recipeId, isDeleted: false });
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.status(200).json(recipe);
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).json({ message: 'Error fetching recipe', error: error.message });
    }
};

// Update Recipe
export const updateRecipe = async (req, res) => {
    const { title, ingredients, instructions, categoryId } = req.body;
    const { recipeId } = req.params;

    try {
        const recipe = await Recipe.findOne({ recipeId, isDeleted: false });
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        recipe.title = title || recipe.title;
        recipe.ingredients = ingredients ? (Array.isArray(ingredients) ? ingredients : JSON.parse(ingredients)) : recipe.ingredients;
        recipe.instructions = instructions || recipe.instructions;
        recipe.categoryId = categoryId || recipe.categoryId;

        if (req.file) {
            recipe.imageUrl = await uploadImage(req.file.buffer);
        }

        recipe.lastUpdated = Date.now();
        await recipe.save();
        res.status(200).json(recipe);
    } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).json({ message: 'Error updating recipe', error: error.message });
    }
};

// Delete Recipe
export const deleteRecipe = async (req, res) => {
    const { recipeId } = req.params;

    try {
        const recipe = await Recipe.findOne({ recipeId });
        if (!recipe || recipe.isDeleted) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        recipe.isDeleted = true;
        await recipe.save();
        res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting recipe', error: error.message });
    }
};

// Search Recipes
export const searchRecipes = async (req, res) => {
    const { query } = req.query;

    try {
        if (typeof query !== 'string' || !query) {
            return res.status(400).json({ message: 'Invalid search query' });
        }

        const recipes = await Recipe.find({
            title: { $regex: query, $options: 'i' },
            isDeleted: false,
        });

        res.status(200).json(recipes);
    } catch (error) {
        console.error("Error during search:", error);
        res.status(500).json({ message: 'Error searching recipes', error: error.message });
    }
};

// Function to fetch and save recipes by category
export const fetchAndSaveRecipesByCategory = async (req, res) => {
    const { userId, categoryId, categoryName } = req.params;

    try {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`);
        const meals = response.data.meals;

        if (!meals) {
            return res.status(404).json({ message: 'No meals found for this category.' });
        }

        const recipesToSave = await Promise.all(meals.map(async meal => {
            const mealResponse = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
            const mealDetails = mealResponse.data.meals[0];

            const ingredients = [];
            for (let i = 1; i <= 20; i++) {
                const ingredient = mealDetails[`strIngredient${i}`];
                const measure = mealDetails[`strMeasure${i}`];
                if (ingredient) {
                    ingredients.push(`${measure} ${ingredient}`);
                }
            }

            return {
                title: mealDetails.strMeal,
                ingredients,
                instructions: mealDetails.strInstructions,
                userId: userId,
                imageUrl: mealDetails.strMealThumb,
                categoryId: categoryId,
            };
        }));

        await Recipe.insertMany(recipesToSave);

        res.status(201).json({ message: 'Recipes saved successfully.', recipes: recipesToSave });
    } catch (error) {
        console.error('Error fetching and saving recipes:', error);
        res.status(500).json({ message: 'Error fetching and saving recipes', error: error.message });
    }
};

// Get Recipes by Category ID
export const getRecipesByCategoryId = async (req, res) => {
    const { categoryId } = req.params;
  
    try {
        const recipes = await Recipe.find({ categoryId, isDeleted: false });
        if (recipes.length === 0) {
            return res.status(404).json({ message: 'No recipes found for this category' });
        }
        res.status(200).json(recipes);
    } catch (error) {
        console.error('Error fetching recipes by category:', error);
        res.status(500).json({ message: 'Error fetching recipes', error: error.message });
    }
  };
  

  // Get 10 random recipes
  export const getRandomRecipes = async (req, res) => {
    try {
      const recipes = await Recipe.aggregate([{ $match: { isDeleted: false } }, { $sample: { size: 10 } }]);
      res.status(200).json(recipes);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching random recipes', error: error.message });
    }
  };
  
  // Get Recipes by User ID
export const getRecipesByUserId = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const recipes = await Recipe.find({ userId, isDeleted: false });
      if (recipes.length === 0) {
        return res.status(404).json({ message: 'No recipes found for this user' });
      }
      res.status(200).json(recipes);
    } catch (error) {
      console.error('Error fetching recipes by user ID:', error);
      res.status(500).json({ message: 'Error fetching recipes', error: error.message });
    }
  };
  