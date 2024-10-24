import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const commentSchema = new mongoose.Schema({
  commentId: { type: String, default: uuidv4, unique: true },  
  userId: { type: String, required: true }, // User ID of the commenter
  recipeId: { type: String, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;