import express from 'express';
import * as lyricsController from '../controllers/lyricsController.js';

const router = express.Router();

router.get('/:songId', lyricsController.getLyrics);
router.get('/:songId/timed', lyricsController.getTimedLyrics);

export default router;