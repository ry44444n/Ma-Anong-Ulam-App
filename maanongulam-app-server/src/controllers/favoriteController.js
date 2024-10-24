import Favorite from '../models/Favorite.js';

// Add a recipe to favorites
export const addFavorite = async (req, res) => {
  const { userId, recipeId } = req.body;

  try {
    const existingFavorite = await Favorite.findOne({ userId, recipeId });
    if (existingFavorite) {
      return res.status(400).json({ message: 'Recipe already favorited' });
    }

    const favorite = new Favorite({ userId, recipeId });
    await favorite.save();
    res.status(201).json({ message: 'Recipe added to favorites' });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ message: 'Error adding favorite', error });
  }
};

// Remove a recipe from favorites (unfavorite)
export const removeFavorite = async (req, res) => {
  const { userId, recipeId } = req.body;

  try {
    const result = await Favorite.deleteOne({ userId, recipeId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.status(200).json({ message: 'Recipe removed from favorites' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ message: 'Error removing favorite', error });
  }
};

// Get favorites for a user
export const getFavorites = async (req, res) => {
  const { userId } = req.params;

  try {
    const favorites = await Favorite.find({ userId }).populate('recipeId');
    res.status(200).json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Error fetching favorites', error });
  }
};

// Get the count of favorites for a specific recipe
export const getFavoritesCount = async (req, res) => {
  const { recipeId } = req.params;

  try {
    const count = await Favorite.countDocuments({ recipeId });
    res.status(200).json({ count });
  } catch (error) {
    console.error('Failed to fetch favorite count:', error);
    res.status(500).json({ error: 'Failed to fetch favorite count.' });
  }
};