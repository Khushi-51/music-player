import express from 'express';
import * as searchController from '../controllers/searchController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Search route (can be used with or without authentication)
router.get('/', authenticate, searchController.search);
router.get('/song/:id', searchController.getSongDetails);
router.get('/album/:id', searchController.getAlbumDetails);

export default router;