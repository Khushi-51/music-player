import axios from 'axios';

// Replace with your server URL
const API_URL = 'http://localhost:5000';
let token = '';

// Helper function to make authorized requests
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Set auth token for requests
const setAuthToken = (authToken) => {
  token = authToken;
  api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
};

// Test user registration
const testRegister = async () => {
  try {
    const response = await api.post('/api/auth/register', {
      username: `user_${Date.now()}`,
      email: `user_${Date.now()}@example.com`,
      password: 'password123'
    });
    
    console.log('Registration successful:', response.data);
    setAuthToken(response.data.token);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
    throw error;
  }
};

// Test user login
const testLogin = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', {
      email,
      password
    });
    
    console.log('Login successful:', response.data);
    setAuthToken(response.data.token);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error;
  }
};

// Test search functionality
const testSearch = async (query) => {
  try {
    const response = await api.get(`/api/search?q=${query}`);
    console.log('Search results:', response.data);
    return response.data;
  } catch (error) {
    console.error('Search failed:', error.response?.data || error.message);
  }
};

// Test playlist creation
const testCreatePlaylist = async () => {
  try {
    const response = await api.post('/api/playlists', {
      name: `My Playlist ${Date.now()}`,
      description: 'My awesome playlist',
      isPublic: true
    });
    
    console.log('Playlist created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Playlist creation failed:', error.response?.data || error.message);
  }
};

// Test adding a song to a playlist
const testAddSongToPlaylist = async (playlistId, songId) => {
  try {
    const response = await api.post(`/api/playlists/${playlistId}/songs`, {
      songId
    });
    
    console.log('Song added to playlist:', response.data);
    return response.data;
  } catch (error) {
    console.error('Adding song to playlist failed:', error.response?.data || error.message);
  }
};

// Test getting recommendations
const testGetRecommendations = async () => {
  try {
    const response = await api.get('/api/recommendations');
    console.log('Recommendations:', response.data);
    return response.data;
  } catch (error) {
    console.error('Getting recommendations failed:', error.response?.data || error.message);
  }
};

// Test downloading a song
const testDownloadSong = async (songId) => {
  try {
    const response = await api.get(`/api/downloads/${songId}`);
    console.log('Song download info:', response.data);
    return response.data;
  } catch (error) {
    console.error('Downloading song failed:', error.response?.data || error.message);
  }
};

// Test getting lyrics
const testGetLyrics = async (songId) => {
  try {
    const response = await api.get(`/api/lyrics/${songId}`);
    console.log('Lyrics:', response.data);
    return response.data;
  } catch (error) {
    console.error('Getting lyrics failed:', error.response?.data || error.message);
  }
};

// Run tests
const runTests = async () => {
  try {
    // Register a new user
    const userData = await testRegister();
    
    // Search for a song
    const searchResults = await testSearch('despacito');
    
    if (searchResults && searchResults.results && searchResults.results.length > 0) {
      const songId = searchResults.results[0].id;
      
      // Create a playlist
      const playlist = await testCreatePlaylist();
      
      if (playlist) {
        // Add the song to the playlist
        await testAddSongToPlaylist(playlist._id, songId);
      }
      
      // Get recommendations
      await testGetRecommendations();
      
      // Download the song
      await testDownloadSong(songId);
      
      // Get lyrics
      await testGetLyrics(songId);
    }
    
    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Test runner failed:', error);
  }
};

// Run the tests
runTests();