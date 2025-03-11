import * as recommendationService from '../services/recommendationService.js';

// Get personalized recommendations for user
export const getRecommendations = async (req, res, next) => {
  try {
    const recommendations = await recommendationService.getPersonalizedRecommendations(req.user._id);
    
    res.json({ recommendations });
  } catch (error) {
    next(error);
  }
};