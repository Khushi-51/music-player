const songService = require('../services/songService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

exports.getAllSongs = async (req, res) => {
  try {
    const songs = await songService.getAllSongs();
    successResponse(res, 'Songs retrieved successfully', songs);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

exports.getSongById = async (req, res) => {
  try {
    const song = await songService.getSongById(req.params.id);
    if (!song) {
      return errorResponse(res, 'Song not found', 404);
    }
    successResponse(res, 'Song retrieved successfully', song);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

exports.createSong = async (req, res) => {
  try {
    const song = await songService.createSong(req.body);
    successResponse(res, 'Song created successfully', song, 201);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

exports.updateSong = async (req, res) => {
  try {
    const song = await songService.updateSong(req.params.id, req.body);
    if (!song) {
      return errorResponse(res, 'Song not found', 404);
    }
    successResponse(res, 'Song updated successfully', song);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

exports.deleteSong = async (req, res) => {
  try {
    const song = await songService.deleteSong(req.params.id);
    if (!song) {
      return errorResponse(res, 'Song not found', 404);
    }
    successResponse(res, 'Song deleted successfully', song);
  } catch (error) {
    errorResponse(res, error.message);
  }
};