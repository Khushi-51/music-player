import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Playlist from '../models/Playlist.js';

export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.' });
    }
    next(error);
  }
};

export const authorizePlaylist = async (req, res, next) => {
  try {
    // This middleware will check if user owns the playlist
    const playlistId = req.params.id;
    const userId = req.user._id;
    
    const playlist = await Playlist.findById(playlistId);
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found.' });
    }
    
    // Check if user owns the playlist or if playlist is public for viewing
    if (playlist.user.toString() !== userId.toString() && req.method !== 'GET') {
      return res.status(403).json({ message: 'Access denied. You do not own this playlist.' });
    }
    
    // If it's a GET request and playlist is not public, only owner can view
    if (req.method === 'GET' && !playlist.isPublic && playlist.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'This playlist is private.' });
    }
    
    req.playlist = playlist;
    next();
  } catch (error) {
    next(error);
  }
};