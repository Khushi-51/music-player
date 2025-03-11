import express from 'express';
import * as downloadController from '../controllers/downloadController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', downloadController.getUserDownloads);
router.get('/:songId', downloadController.downloadSong);
router.delete('/:downloadId', downloadController.deleteDownload);

// Admin route to clean up expired downloads
// In a real app, you would add admin authorization middleware
router.post('/cleanup', downloadController.cleanupExpiredDownloads);

export default router;