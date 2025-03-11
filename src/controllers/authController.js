import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Register a new user
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email or username' });
    }
    
    // Create new user
    const user = new User({
      username,
      email,
      password,
      preferences: {
        favoritedGenres: [],
        recentSearches: []
      }
    });
    
    // Save user to database
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return user data and token
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login existing user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return user data and token
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get current user profile
export const getProfile = async (req, res, next) => {
  try {
    // User is attached to request in auth middleware
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        profilePicture: req.user.profilePicture,
        preferences: req.user.preferences
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
export const updateProfile = async (req, res, next) => {
  try {
    const { username, email, profilePicture, preferences } = req.body;
    
    // Find user
    const user = await User.findById(req.user._id);
    
    // Update fields if provided
    if (username) user.username = username;
    if (email) user.email = email;
    if (profilePicture) user.profilePicture = profilePicture;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };
    
    // Save updated user
    await user.save();
    
    // Return updated user data
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        preferences: user.preferences
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update password
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Find user
    const user = await User.findById(req.user._id);
    
    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};