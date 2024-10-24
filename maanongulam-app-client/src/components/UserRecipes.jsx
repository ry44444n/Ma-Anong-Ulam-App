import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaStar, FaThumbsUp, FaHeart } from 'react-icons/fa';
import { fetchUserData } from '../api/userApi';

const UserRecipes = ({
  recipeId,
  title,
  imageUrl,
  ingredients,
  instructions,
  creator,
  userRating,
  averageRating,
  handleRating,
}) => {
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data for recipeId:", recipeId);
      setLoading(true); // Start loading
      try {
        const loggedInUserId = localStorage.getItem('userId');
        console.log("Logged in User ID:", loggedInUserId);
        setUserId(loggedInUserId);
  
        const likesResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/ratings/likes/${recipeId}`);
        console.log("Fetched Likes:", likesResponse.data);
        setLikes(likesResponse.data.likes);
  
        const favoritesResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/favorites/recipeId/${recipeId}`);
        console.log("Fetched Favorites:", favoritesResponse.data);
        setFavoriteCount(favoritesResponse.data.favoriteCount);
        const userFavorite = favoritesResponse.data.favorites.find(fav => fav.userId === loggedInUserId);
        setIsFavorited(!!userFavorite);
  
        const commentsResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/comments/recipeId/${recipeId}`);
        console.log("Fetched Comments:", commentsResponse.data);
        const enrichedComments = await Promise.all(commentsResponse.data.map(async (comment) => {
          const user = await fetchUserData(comment.userId);
          return { ...comment, user };
        }));
        setComments(enrichedComments);
  
      } catch (error) {
        console.error("Error fetching recipe details:", error.response?.data || error.message);
      } finally {
        setLoading(false); // End loading
      }
    };
  
    if (recipeId) {
      fetchData();
    } else {
      console.error("No recipeId found");
    }
  }, [recipeId]);
  
  const handleFavorite = async () => {
    try {
      if (isFavorited) {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/favorites`, { data: { userId, recipeId } });
        setIsFavorited(false);
        setFavoriteCount((prevCount) => prevCount - 1);
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/favorites`, { userId, recipeId });
        setIsFavorited(true);
        setFavoriteCount((prevCount) => prevCount + 1);
      }
    } catch (error) {
      console.error('Error favoriting recipe:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      alert('Comment cannot be empty');
      return;
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/comments`, {
        userId,
        recipeId,
        comment: newComment,
      });
      const userComment = await fetchUserData(userId);
      setComments((prevComments) => [...prevComments, { ...response.data, user: userComment }]);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div className="w-full max-w-5xl p-4 bg-white rounded-lg shadow-lg flex flex-col md:flex-row space-x-4">
      <div className="w-full md:w-1/2 bg-gray-50 p-6 overflow-y-auto h-96 border-r-4">
        <h2 className="text-orange-400 font-recia text-3xl font-bold mb-4">{title}</h2>
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover mb-4 rounded-md" />
        {creator && <p className="text-black text-md">Created by: {creator.firstName} {creator.lastName}</p>}

        <div className="text-md text-gray-700 mb-2">Favorited by {favoriteCount} people</div>

        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`cursor-pointer ${i < userRating ? 'text-yellow-400' : 'text-gray-300'}`}
              onClick={() => handleRating(i + 1)}
            />
          ))}
          <span className="ml-2 text-sm">Rating: {averageRating.toFixed(1)}</span>
        </div>

        <div className="flex justify-between items-center mt-4">
          <button onClick={handleFavorite} className={`flex items-center ${isFavorited ? 'text-red-500' : 'text-gray-600'} hover:text-red-500`}>
            <FaHeart className="mr-1" /> {isFavorited ? 'Unfavorite' : 'Favorite'}
          </button>
          <span className="ml-4 flex items-center">
            <FaThumbsUp className="mr-1" /> {likes}
          </span>
        </div>
      </div>

      <div className="w-full md:w-1/2 bg-gray-50 p-6 overflow-y-auto h-96">
        <h3 className="text-black text-2xl font-bold mb-2">Ingredients</h3>
        <ul className="list-disc pl-5">
          {ingredients.map((ingredient, index) => (
            <li key={index} className="text-gray-700">{ingredient}</li>
          ))}
        </ul>

        <h3 className="text-black text-2xl font-bold mt-4 mb-2">Instructions</h3>
        <p className="text-gray-700">{instructions}</p>

        {/* Comments Section */}
        <div className="mt-4">
          <h3 className="text-black text-xl font-bold">Comments</h3>
          <ul className="list-none p-0">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <li key={comment._id} className="mb-2">
                  <div className="text-sm text-gray-600">{comment.user.firstName} {comment.user.lastName}</div>
                  <p className="text-gray-800">{comment.comment}</p>
                </li>
              ))
            ) : (
              <p className="text-gray-600">No comments yet. Be the first to comment!</p>
            )}
          </ul>

          <form onSubmit={handleCommentSubmit} className="mt-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-2 border rounded-md"
              rows="3"
            />
            <button
              type="submit"
              className="bg-orange-400 text-white p-2 mt-2 rounded-md"
            >
              Submit Comment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRecipes;
