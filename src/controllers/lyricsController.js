import * as lyricsService from '../services/lyricsService.js';
import * as jiosaavnService from '../services/jiosaavnService.js';

// Get lyrics for a song
export const getLyrics = async (req, res, next) => {
  try {
    const { songId } = req.params;
    
    const lyrics = await jiosaavnService.getSongLyrics(songId);
    
    if (!lyrics || lyrics.error) {
      return res.status(404).json({ message: 'Lyrics not found for this song' });
    }
    
    res.json(lyrics);
  } catch (error) {
    next(error);
  }
};

// Get timed lyrics for karaoke mode
export const getTimedLyrics = async (req, res, next) => {
  try {
    const { songId } = req.params;
    
    const timedLyrics = await lyricsService.getTimedLyrics(songId);
    
    res.json(timedLyrics);
  } catch (error) {
    next(error);
  }
};