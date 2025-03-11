import * as downloadService from '../services/downloadService.js';

// Download a song
export const downloadSong = async (req, res, next) => {
  try {
    const { songId } = req.params;
    
    const download = await downloadService.downloadSong(songId, req.user._id);
    
    res.json({
      success: true,
      download: {
        id: download._id,
        title: download.title,
        artist: download.artist,
        downloadUrl: `/downloads/${download.filePath}`,
        fileSize: download.fileSize,
        downloadDate: download.downloadDate,
        expiryDate: download.expiryDate
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all downloads for current user
export const getUserDownloads = async (req, res, next) => {
  try {
    const downloads = await downloadService.getUserDownloads(req.user._id);
    
    const downloadsList = downloads.map(download => ({
      id: download._id,
      title: download.title,
      artist: download.artist,
      album: download.album,
      downloadUrl: `/downloads/${download.filePath}`,
      fileSize: download.fileSize,
      downloadDate: download.downloadDate,
      expiryDate: download.expiryDate
    }));
    
    res.json({ downloads: downloadsList });
  } catch (error) {
    next(error);
  }
};

// Delete a download
export const deleteDownload = async (req, res, next) => {
  try {
    const { downloadId } = req.params;
    
    const result = await downloadService.deleteDownload(downloadId, req.user._id);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Clean up expired downloads (admin only)
export const cleanupExpiredDownloads = async (req, res, next) => {
  try {
    const result = await downloadService.cleanupExpiredDownloads();
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};