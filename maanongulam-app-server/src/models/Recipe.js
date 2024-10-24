import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: { type: [String], required: true },
  instructions: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  userId: { type: String, required: true },
  imageUrl: { type: String },
  categoryId: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  lastUpdated: { type: Date, default: Date.now },
  recipeId: { type: String, default: uuidv4, unique: true },
});

// Update lastUpdated field before saving
recipeSchema.pre('save', function (next) {
  this.lastUpdated = Date.now();
  next();
});

const Recipe = mongoose.model('Recipe', recipeSchema);
export default Recipe;
