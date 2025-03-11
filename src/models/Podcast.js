import mongoose from 'mongoose';

const podcastSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  podcastId: {
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
  description: String,
  coverImage: String,
  episodes: [{
    episodeId: String,
    title: String,
    duration: Number,
    releaseDate: Date,
    description: String,
    listenedTo: Boolean,
    currentPosition: Number
  }],
  isSubscribed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Podcast = mongoose.model('Podcast', podcastSchema);

export default Podcast;