import mongoose from 'mongoose';

const downloadSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  songId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  album: String,
  filePath: {
    type: String,
    required: true
  },
  fileSize: Number,
  downloadDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: true
  }
}, { timestamps: true });

// Index for finding and cleaning expired downloads
downloadSchema.index({ expiryDate: 1 });

const Download = mongoose.model('Download', downloadSchema);

export default Download;