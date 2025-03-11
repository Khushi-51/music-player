import * as jiosaavnService from '../services/jiosaavnService.js';
import User from '../models/User.js';

// Search for songs, albums, playlists, or podcasts
export const search = async (req, res, next) => {
  try {
    const { q, type = 'songs', page = 1, limit = 20 } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    let results;
    
    // Search based on type
    switch (type) {
      case 'songs':
        results = await jiosaavnService.searchSongs(q, page, limit);
        break;
      case 'albums':
        results = await jiosaavnService.searchAlbums(q, page, limit);
        break;
      case 'playlists':
        results = await jiosaavnService.searchPlaylists(q, page, limit);
        break;
      case 'podcasts':
        results = await jiosaavnService.searchPodcasts(q, page, limit);
        break;
      default:
        results = await jiosaavnService.searchSongs(q, page, limit);
    }
    
    // If user is authenticated, add search term to recent searches
    if (req.user) {
      await updateRecentSearches(req.user._id, q);
    }
    
    res.json(results);
  } catch (error) {
    next(error);
  }
};

// Update user's recent searches
const updateRecentSearches = async (userId, searchTerm) => {
  try {
    const user = await User.findById(userId);
    
    if (user && user.preferences) {
      // Add search term to recent searches if it doesn't exist already
      if (!user.preferences.recentSearches) {
        user.preferences.recentSearches = [];
      }
      
      // Remove term if it already exists (to move it to the front)
      const index = user.preferences.recentSearches.indexOf(searchTerm);
      if (index !== -1) {
        user.preferences.recentSearches.splice(index, 1);
      }
      
      // Add term to the beginning of the array
      user.preferences.recentSearches.unshift(searchTerm);
      
      // Limit to 10 recent searches
      user.preferences.recentSearches = user.preferences.recentSearches.slice(0, 10);
      
      await user.save();
    }
  } catch (error) {
    console.error('Error updating recent searches:', error);
  }
};

// Get song details by ID
export const getSongDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const songDetails = await jiosaavnService.getSongDetails(id);
    
    if (!songDetails) {
      return res.status(404).json({ message: 'Song not found' });
    }
    
    res.json(songDetails);
  } catch (error) {
    next(error);
  }
};

// Get album details by ID
export const getAlbumDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const albumDetails = await jiosaavnService.getAlbumDetails(id);
    
    if (!albumDetails) {
      return res.status(404).json({ message: 'Album not found' });
    }
    
    res.json(albumDetails);
  } catch (error) {
    next(error);
  }
};