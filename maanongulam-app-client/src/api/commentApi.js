import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const updateComment = async (commentId, commentText) => {
  if (!commentId) {
    throw new Error('Comment ID is required for updating.'); // Ensure you have the comment ID
  }

  const response = await axios.put(`${API_URL}/api/comments/${commentId}`, {
    comment: commentText,
  });
  return response.data; // Return the updated comment
};

export const fetchCommentsByRecipeId = async (recipeId) => {
  const response = await axios.get(`${API_URL}/api/comments/recipeId/${recipeId}`);
  return response.data;
};

export const postComment = async (userId, recipeId, comment) => {
  const response = await axios.post(`${API_URL}/api/comments`, {
    userId,
    recipeId,
    comment,
  });
  return response.data;
};

export const deleteComment = async (commentId) => {
  await axios.delete(`${API_URL}/api/comments/${commentId}`);
};