import express from 'express';
import songController from '../controllers/songController.js';
import { authenticate, authorizePlaylist } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', songController.getAllSongs);
router.get('/:id', songController.getSongById);
router.post('/', authenticate, songController.createSong);
router.put('/:id', authenticate, songController.updateSong);
router.delete('/:id', authenticate, songController.deleteSong);

export default router;
