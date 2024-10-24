import Comment from '../models/Comment.js';

// Create a new comment
export const createComment = async (req, res) => {
  const { userId, recipeId, comment } = req.body;

  try {
    const newComment = new Comment({ userId, recipeId, comment });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Error creating comment', error });
  }
};

// Get comments for a specific recipe
export const getCommentsByRecipe = async (req, res) => {
  const { recipeId } = req.params;

  try {
    const comments = await Comment.find({ recipeId, isDeleted: false }); // Filter out deleted comments
    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Error fetching comments', error });
  }
};

// Update a comment by id
export const updateComment = async (req, res) => {
  const { id } = req.params; // Accessing the id parameter
  const { comment } = req.body;

  try {
    const updatedComment = await Comment.findOneAndUpdate(
      { _id: id }, // Lookup by commentId using the id parameter
      { comment, lastUpdated: Date.now() }, // Update the comment and lastUpdated field
      { new: true }
    );

    if (!updatedComment || updatedComment.isDeleted) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.status(200).json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Error updating comment', error });
  }
};

// Soft delete a comment by id
export const deleteComment = async (req, res) => {
  const { id } = req.params; // Accessing the id parameter
  

  try {
    const deletedComment = await Comment.findOneAndUpdate(
      { _id: id }, // Lookup by commentId using the id parameter
      { isDeleted: true }, // Set isDeleted to true
      { new: true }
    );

    if (!deletedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Error deleting comment', error });
  }
};