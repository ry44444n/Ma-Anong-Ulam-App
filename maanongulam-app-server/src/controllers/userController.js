import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // Import jwt

const handleError = (res, message, error, statusCode = 500) => {
  console.error(message, error);
  res.status(statusCode).json({ message, error });
};

const saveUser = async (user, res) => {
  try {
    await user.save();
    console.log('User saved successfully');
  } catch (error) {
    return handleError(res, 'Error saving user', error);
  }
};

// Register route
export const registerUser = async (req, res) => {
  const { username, email, password, firstName, lastName, contactNumber } = req.body; // Include contactNumber

  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ username, email, password, firstName, lastName, contactNumber }); // Include contactNumber
    console.log('User object before saving:', user);
    await saveUser(user, res);

    res.status(201).json({ message: 'User registered successfully', userId: user.userId });
  } catch (error) {
    handleError(res, 'Error registering user', error);
  }
};

// Login route
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update lastLogin field
    user.lastLogin = new Date();
    console.log('Updating lastLogin:', user.lastLogin);
    await saveUser(user, res);

    // Generate a token
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token, userId: user.userId });
  } catch (error) {
    handleError(res, 'Error logging in', error);
  }
};

// Get user by username
export const getUserByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userDetails } = user.toObject();
    res.status(200).json(userDetails);
  } catch (error) {
    handleError(res, 'Error fetching user', error);
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isDeleted = true; // Mark user as deleted
    await saveUser(user, res);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    handleError(res, 'Error deleting user', error);
  }
};

// Deactivate user
export const deactivateUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isDeactivated = true; // Mark user as deactivated
    await saveUser(user, res);
    res.status(200).json({ message: 'User deactivated successfully' });
  } catch (error) {
    handleError(res, 'Error deactivating user', error);
  }
};

// Update user
export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const updates = req.body; // Assuming you send the fields to update in the request body

  try {
      const user = await User.findOne({ userId });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Update user fields
      Object.assign(user, updates);
      await saveUser(user, res); // Save the updated user

      res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
      handleError(res, 'Error updating user', error);
  }
};

// Get user by userId
export const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
      const user = await User.findOne({ userId });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const { password, ...userDetails } = user.toObject();
      res.status(200).json(userDetails);
  } catch (error) {
      handleError(res, 'Error fetching user', error);
  }
};
