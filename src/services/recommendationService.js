import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import NodeCache from 'node-cache';
import * as jiosaavnService from './jiosaavnService.js';
import User from '../models/User.js';
import Playlist from '../models/Playlist.js';

const recommendationCache = new NodeCache({ stdTTL: 3600 * 24 }); // 24 hour cache

// Function to get recommendations based on user history and preferences
export const getPersonalizedRecommendations = async (userId) => {
  const cacheKey = `recommendations_${userId}`;
  
  // Check if cached recommendations exist
  const cachedRecommendations = recommendationCache.get(cacheKey);
  if (cachedRecommendations) {
    return cachedRecommendations;
  }
  
  try {
    // Get user data
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Get user playlists
    const userPlaylists = await Playlist.find({ user: userId });
    
    // Extract song information for AI analysis
    let listeningHistory = [];
    userPlaylists.forEach(playlist => {
      playlist.songs.forEach(song => {
        listeningHistory.push({
          title: song.title,
          artist: song.artist,
          album: song.album || ''
        });
      });
    });
    
    // Limit history to prevent token limit issues
    listeningHistory = listeningHistory.slice(0, 50);
    
    // Get recommendations from AI
    const recommendations = await getAIRecommendations(listeningHistory, user.preferences?.favoritedGenres || []);
    
    // Cache the recommendations
    recommendationCache.set(cacheKey, recommendations);
    
    return recommendations;
  } catch (error) {
    console.error('Error generating recommendations:', error);
    
    // Fallback to trending songs if AI recommendations fail
    return getTrendingSongs();
  }
};

// Function to use AI for generating recommendations
const getAIRecommendations = async (listeningHistory, favoriteGenres) => {
  try {
    // Create prompt for the AI
    const prompt = `
    Based on the following user's listening history and favorite genres, recommend 10 songs they might enjoy.
    
    Listening History:
    ${listeningHistory.map(song => `- ${song.title} by ${song.artist}`).join('\n')}
    
    Favorite Genres:
    ${favoriteGenres.join(', ') || 'No specific genres provided'}
    
    Please provide your recommendations in the following JSON format:
    [
      {"title": "Song Title", "artist": "Artist Name"},
      ...
    ]
    
    Only respond with the JSON array and nothing else.
    `;
    
    // Call OpenAI API
    const { text } = await generateText({
      model: openai('gpt-4o'),
      prompt: prompt
    });
    
    // Parse response
    const recommendedSongs = JSON.parse(text);
    
    // Fetch additional details for each recommendation
    const enhancedRecommendations = await Promise.all(
      recommendedSongs.map(async (song) => {
        try {
          const searchResult = await jiosaavnService.searchSongs(`${song.title} ${song.artist}`, 1, 1);
          if (searchResult && searchResult.results && searchResult.results.length > 0) {
            return {
              ...song,
              id: searchResult.results[0].id,
              album: searchResult.results[0].album || '',
              coverImage: searchResult.results[0].image || ''
            };
          }
          return song;
        } catch (error) {
          console.error(`Error fetching details for song ${song.title}:`, error);
          return song;
        }
      })
    );
    
    return enhancedRecommendations;
  } catch (error) {
    console.error('Error in AI recommendations:', error);
    throw error;
  }
};

// Fallback function to get trending songs
const getTrendingSongs = async () => {
  try {
    // This is a placeholder - in a real implementation, you would
    // fetch trending songs from JioSaavn or another source
    const trendingResult = await jiosaavnService.searchSongs('trending', 1, 10);
    return trendingResult.results || [];
  } catch (error) {
    console.error('Error fetching trending songs:', error);
    return [];
  }
};