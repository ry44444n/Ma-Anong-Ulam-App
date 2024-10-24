import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchFavoritesCount = async (recipeId) => {
const response = await axios.get(`${API_URL}/api/favorites/count/${recipeId}`);

return response.data.count;
};

export const checkIfFavorited = (favorites, userId) => {
  return favorites.find(fav => fav.userId === userId);
};

export const addFavorite = async (userId, recipeId) => {
  await axios.post(`${API_URL}/api/favorites`, { userId, recipeId });
};

export const removeFavorite = async (userId, recipeId) => {
  await axios.delete(`${API_URL}/api/favorites`, {
    data: { userId, recipeId },
  });
};
