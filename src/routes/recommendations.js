import express from 'express';
import * as recommendationController from '../controllers/recommendationController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', recommendationController.getRecommendations);

export default router;