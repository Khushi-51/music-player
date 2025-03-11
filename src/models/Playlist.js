import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  songs: [{
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
    duration: Number,
    coverImage: String,
    dateAdded: {
      type: Date,
      default: Date.now
    }
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  shareableLink: {
    type: String,
    unique: true,
    sparse: true
  }
}, { timestamps: true });

// Generate shareable link when a playlist is made public
playlistSchema.pre('save', function(next) {
  if (this.isModified('isPublic') && this.isPublic && !this.shareableLink) {
    this.shareableLink = `${this._id}-${Date.now()}`;
  }
  next();
});

const Playlist = mongoose.model('Playlist', playlistSchema);

export default Playlist;