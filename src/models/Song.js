const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String },
  duration: { type: Number },
  genre: { type: String },
  releaseDate: { type: Date },
  audioUrl: { type: String, required: true },
  coverImageUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Song', SongSchema);