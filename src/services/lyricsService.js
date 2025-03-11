import * as jiosaavnService from './jiosaavnService.js';

// Function to get lyrics with timestamps for karaoke mode
export const getTimedLyrics = async (songId) => {
  try {
    const lyricsData = await jiosaavnService.getSongLyrics(songId);

    if (!lyricsData || lyricsData.error) {
      return { error: 'Lyrics not available for this song' };
    }

    // Check if lyrics contain timestamps
    if (lyricsData.lyrics && lyricsData.lyrics.includes('[')) {
      return parseTimedLyrics(lyricsData.lyrics);
    }

    // Return raw lyrics if no timestamps
    return {
      hasTimestamps: false,
      rawLyrics: lyricsData.lyrics
    };
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    return { error: 'Failed to fetch lyrics' };
  }
};

// Function to parse timed lyrics for karaoke mode
const parseTimedLyrics = (lyrics) => {
  try {
    // Regular expression to match timestamp format [mm:ss.xx]
    const timestampRegex = /\[(\d{2}):(\d{2})\.(\d{2})\]/;

    // Split lyrics into lines and process each line
    const timedLyrics = lyrics.split('\n').map(line => {
      const timestampMatch = line.match(timestampRegex);
      if (timestampMatch) {
        const minutes = parseInt(timestampMatch[1], 10);
        const seconds = parseInt(timestampMatch[2], 10);
        const milliseconds = parseInt(timestampMatch[3], 10) * 10;

        const timeInMs = (minutes * 60 * 1000) + (seconds * 1000) + milliseconds;
        const text = line.replace(timestampRegex, '').trim();

        return { time: timeInMs, text };
      }

      // Return line without timestamp
      return { time: null, text: line.trim() };
    }).filter(line => line.text); // Remove empty lines

    return {
      hasTimestamps: timedLyrics.some(line => line.time !== null),
      timedLyrics
    };
  } catch (error) {
    console.error('Error parsing timed lyrics:', error);
    return {
      hasTimestamps: false,
      rawLyrics: lyrics
    };
  }
};
