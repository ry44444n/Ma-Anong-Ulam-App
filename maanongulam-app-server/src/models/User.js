import mongoose from 'mongoose'; 
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4
import bcrypt from 'bcryptjs'; // Import bcrypt

const userSchema = new mongoose.Schema({
  userId: { type: String, default: uuidv4, unique: true }, // Use uuidv4 for userId
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  contactNumber: { type: String }, // Added contactNumber
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date }, // Field to store the last login timestamp
  isDeleted: { type: Boolean, default: false }, 
  isDeactivated: { type: Boolean, default: false } 
});

// Hash password before saving user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

export default User;