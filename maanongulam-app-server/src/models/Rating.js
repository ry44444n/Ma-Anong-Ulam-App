import mongoose from 'mongoose'; 
import { v4 as uuidv4 } from 'uuid';

const ratingSchema = new mongoose.Schema({
  ratingId: { type: String, default: uuidv4, unique: true },  
  userId: { type: String, required: true },                 
  recipeId: { type: String, required: true },               
  rating: { type: Number, default: 0, min: 0, max: 5 },     
  isLiked: { type: Boolean, default: false },               
  createdAt: { type: Date, default: Date.now },            
  lastUpdated: { type: Date, default: Date.now },          
  isDeleted: { type: Boolean, default: false },             
});

const Rating = mongoose.model('Rating', ratingSchema);

export default Rating;