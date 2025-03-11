import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import * as jiosaavnService from './jiosaavnService.js';
import Download from '../models/Download.js';

const DOWNLOAD_DIR = path.join(process.cwd(), 'uploads');
const RETENTION_DAYS = 30; // How long to keep downloaded files

// Ensure downloads directory exists
const ensureDownloadDir = async () => {
  try {
    await fs.access(DOWNLOAD_DIR);
  } catch (error) {
    await fs.mkdir(DOWNLOAD_DIR, { recursive: true });
  }
};

// Download a song from its streaming URL
export const downloadSong = async (songId, userId) => {
  try {
    await ensureDownloadDir();
    
    // Check if song is already downloaded for this user
    const existingDownload = await Download.findOne({ songId, user: userId });
    if (existingDownload) {
      return existingDownload;
    }
    
    // Get song details
    const songDetails = await jiosaavnService.getSongDetails(songId);
    if (!songDetails) {
      throw new Error('Song not found');
    }
    
    // Get streaming URL
    const streamingUrl = await jiosaavnService.getSongStreamingUrl(songId);
    if (!streamingUrl) {
      throw new Error('Streaming URL not available');
    }
    
    // Generate unique filename
    const fileExtension = 'mp3'; // Assuming all songs are mp3
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = path.join(DOWNLOAD_DIR, fileName);
    
    // Download the file
    const response = await axios({
      method: 'GET',
      url: streamingUrl,
      responseType: 'stream'
    });
    
    const writer = fs.createWriteStream(filePath);
    
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', async () => {
        try {
          // Get file size
          const stats = await fs.stat(filePath);
          
          // Calculate expiry date (30 days from now)
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + RETENTION_DAYS);
          
          // Save download record to database
          const download = new Download({
            user: userId,
            songId: songId,
            title: songDetails.title,
            artist: songDetails.artist,
            album: songDetails.album,
            filePath: fileName, // Only store the filename, not the full path
            fileSize: stats.size,
            expiryDate: expiryDate
          });
          
          await download.save();
          resolve(download);
        } catch (error) {
          reject(error);
        }
      });
      
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Error downloading song:', error);
    throw error;
  }
};

// Get all downloads for a user
export const getUserDownloads = async (userId) => {
  try {
    return await Download.find({ user: userId }).sort({ downloadDate: -1 });
  } catch (error) {
    console.error('Error getting user downloads:', error);
    throw error;
  }
};

// Delete a download
export const deleteDownload = async (downloadId, userId) => {
  try {
    const download = await Download.findOne({ _id: downloadId, user: userId });
    
    if (!download) {
      throw new Error('Download not found');
    }
    
    // Delete the file
    const filePath = path.join(DOWNLOAD_DIR, download.filePath);
    try {
      await fs.unlink(filePath);
    } catch (fileError) {
      console.error('Error deleting file:', fileError);
      // Continue even if file delete fails
    }
    
    // Delete the database record
    await Download.deleteOne({ _id: downloadId });
    
    return { success: true, message: 'Download deleted successfully' };
  } catch (error) {
    console.error('Error deleting download:', error);
    throw error;
  }
};

// Clean up expired downloads
export const cleanupExpiredDownloads = async () => {
  try {
    const now = new Date();
    const expiredDownloads = await Download.find({ expiryDate: { $lt: now } });
    
    for (const download of expiredDownloads) {
      try {
        // Delete the file
        const filePath = path.join(DOWNLOAD_DIR, download.filePath);
        await fs.unlink(filePath);
      } catch (fileError) {
        console.error(`Error deleting file for download ${download._id}:`, fileError);
        // Continue deletion even if file removal fails
      }
    }
    
    // Delete all expired download records
    const result = await Download.deleteMany({ expiryDate: { $lt: now } });
    
    return {
      success: true,
      deletedCount: result.deletedCount,
      message: `Deleted ${result.deletedCount} expired downloads`
    };
  } catch (error) {
    console.error('Error cleaning up expired downloads:', error);
    throw error;
  }
};