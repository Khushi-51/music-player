import Playlist from '../models/Playlist.js';
import * as jiosaavnService from '../services/jiosaavnService.js';

// Create a new playlist
export const createPlaylist = async (req, res, next) => {
  try {
    const { name, description, coverImage, isPublic } = req.body;
    
    // Create new playlist
    const playlist = new Playlist({
      name,
      description: description || '',
      coverImage: coverImage || '',
      user: req.user._id,
      songs: [],
      isPublic: isPublic || false
    });
    
    // Save playlist to database
    await playlist.save();
    
    res.status(201).json(playlist);
  } catch (error) {
    next(error);
  }
};

// Get all playlists for the current user
export const getUserPlaylists = async (req, res, next) => {
  try {
    const playlists = await Playlist.find({ user: req.user._id });
    res.json(playlists);
  } catch (error) {
    next(error);
  }
};

// Get a playlist by ID
export const getPlaylistById = async (req, res, next) => {
  try {
    // Playlist is attached to request in authorizePlaylist middleware
    res.json(req.playlist);
  } catch (error) {
    next(error);
  }
};

// Update a playlist
export const updatePlaylist = async (req, res, next) => {
  try {
    const { name, description, coverImage, isPublic } = req.body;
    
    // Update fields if provided
    if (name) req.playlist.name = name;
    if (description !== undefined) req.playlist.description = description;
    if (coverImage) req.playlist.coverImage = coverImage;
    if (isPublic !== undefined) req.playlist.isPublic = isPublic;
    
    // Save updated playlist
    await req.playlist.save();
    
    res.json(req.playlist);
  } catch (error) {
    next(error);
  }
};

// Delete a playlist
export const deletePlaylist = async (req, res, next) => {
  try {
    await Playlist.findByIdAndDelete(req.playlist._id);
    res.json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Add a song to a playlist
export const addSongToPlaylist = async (req, res, next) => {
  try {
    const { songId } = req.body;
    
    // Check if song already exists in playlist
    const songExists = req.playlist.songs.some(song => song.songId === songId);
    if (songExists) {
      return res.status(400).json({ message: 'Song already exists in this playlist' });
    }
    
    // Get song details from JioSaavn
    const songDetails = await jiosaavnService.getSongDetails(songId);
    if (!songDetails) {
      return res.status(404).json({ message: 'Song not found' });
    }
    
    // Add song to playlist
    req.playlist.songs.push({
      songId: songId,
      title: songDetails.title,
      artist: songDetails.artist,
      album: songDetails.album,
      duration: songDetails.duration,
      coverImage: songDetails.image
    });
    
    // Save updated playlist
    await req.playlist.save();
    
    res.json(req.playlist);
  } catch (error) {
    next(error);
  }
};

// Remove a song from a playlist
export const removeSongFromPlaylist = async (req, res, next) => {
  try {
    const { songId } = req.params;
    
    // Remove song from playlist
    req.playlist.songs = req.playlist.songs.filter(song => song.songId !== songId);
    
    // Save updated playlist
    await req.playlist.save();
    
    res.json(req.playlist);
  } catch (error) {
    next(error);
  }
};

// Get playlist by shareable link
export const getPlaylistByShareableLink = async (req, res, next) => {
  try {
    const { shareableLink } = req.params;
    
    // Find public playlist by shareable link
    const playlist = await Playlist.findOne({
      shareableLink,
      isPublic: true
    });
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found or is private' });
    }
    
    res.json(playlist);
  } catch (error) {
    next(error);
  }
};