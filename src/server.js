import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

// Import routes
import authRoutes from './routes/auth.js';
import searchRoutes from './routes/search.js';
import playlistRoutes from './routes/playlists.js';
import songRoutes from './routes/songs.js';
import downloadRoutes from './routes/downloads.js';
import podcastRoutes from './routes/podcasts.js';
import lyricsRoutes from './routes/lyrics.js';
import recommendationRoutes from './routes/recommendations.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Serve static files (CSS, JS, Images, etc.)
app.use(express.static(path.join(process.cwd(), 'public')));

// Static folder for downloads
app.use('/downloads', express.static(path.join(process.cwd(), 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/downloads', downloadRoutes);
// app.use('/api/podcasts', podcastRoutes);
app.use('/api/lyrics', lyricsRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Error handling middleware
app.use(errorHandler);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to JioSaavn API Backend' });
});

// Set routes for very public HTML files
app.get('/login', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'login.html'));
});
app.get('/register', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'register.html'));
});
app.get('/search', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'search.html'));
});
app.get('/playlists', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'playlists.html'));
});
app.get('/player', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'player.html'));
});
app.get('/home', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

export default app;
