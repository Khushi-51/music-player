const Song = require('../models/Song');

exports.getAllSongs = async () => {
  return await Song.find();
};

exports.getSongById = async (id) => {
  return await Song.findById(id);
};

exports.createSong = async (songData) => {
  const song = new Song(songData);
  return await song.save();
};

exports.updateSong = async (id, songData) => {
  return await Song.findByIdAndUpdate(id, songData, { new: true });
};

exports.deleteSong = async (id) => {
  return await Song.findByIdAndDelete(id);
};