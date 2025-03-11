import express from 'express';
import * as playlistController from '../controllers/playlistController.js';
import { authenticate, authorizePlaylist } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// CRUD for playlists
router.post('/', playlistController.createPlaylist);
router.get('/', playlistController.getUserPlaylists);
router.get('/:id', authorizePlaylist, playlistController.getPlaylistById);
router.put('/:id', authorizePlaylist, playlistController.updatePlaylist);
router.delete('/:id', authorizePlaylist, playlistController.deletePlaylist);

// Songs in playlists
router.post('/:id/songs', authorizePlaylist, playlistController.addSongToPlaylist);
router.delete('/:id/songs/:songId', authorizePlaylist, playlistController.removeSongFromPlaylist);

// Share playlist
router.get('/share/:shareableLink', playlistController.getPlaylistByShareableLink);

export default router;