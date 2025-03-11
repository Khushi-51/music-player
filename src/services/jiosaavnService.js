import NodeCache from 'node-cache';
import fetch from 'node-fetch';

// Initialize cache with 1 hour TTL
const cache = new NodeCache({ stdTTL: 3600 });

const fetchFromSaavn = async (endpoint) => {
  try {
    const response = await fetch(`https://saavn.dev/api/${endpoint}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from Saavn API:`, error);
    return null;
  }
};

export const searchSongs = async (query, page = 1, limit = 20) => {
  const cacheKey = `search_songs_${query}_${page}_${limit}`;
  const cachedResult = cache.get(cacheKey);
  if (cachedResult) return cachedResult;

  const result = await fetchFromSaavn(`search/songs?query=${query}&page=${page}&limit=${limit}`);
  if (result) cache.set(cacheKey, result);
  return result;
};

export const searchAlbums = async (query, page = 1, limit = 20) => {
  const cacheKey = `search_albums_${query}_${page}_${limit}`;
  const cachedResult = cache.get(cacheKey);
  if (cachedResult) return cachedResult;

  const result = await fetchFromSaavn(`search/albums?query=${query}&page=${page}&limit=${limit}`);
  if (result) cache.set(cacheKey, result);
  return result;
};

export const searchPlaylists = async (query, page = 1, limit = 20) => {
  const cacheKey = `search_playlists_${query}_${page}_${limit}`;
  const cachedResult = cache.get(cacheKey);
  if (cachedResult) return cachedResult;

  const result = await fetchFromSaavn(`search/playlists?query=${query}&page=${page}&limit=${limit}`);
  if (result) cache.set(cacheKey, result);
  return result;
};

export const searchPodcasts = async (query, page = 1, limit = 20) => {
  const cacheKey = `search_podcasts_${query}_${page}_${limit}`;
  const cachedResult = cache.get(cacheKey);
  if (cachedResult) return cachedResult;

  const result = await fetchFromSaavn(`search/podcasts?query=${query}&page=${page}&limit=${limit}`);
  if (result) cache.set(cacheKey, result);
  return result;
};

export const getSongDetails = async (songId) => {
  const cacheKey = `song_${songId}`;
  const cachedResult = cache.get(cacheKey);
  if (cachedResult) return cachedResult;

  const result = await fetchFromSaavn(`songs?id=${songId}`);
  if (result) cache.set(cacheKey, result);
  return result;
};

export const getAlbumDetails = async (albumId) => {
  const cacheKey = `album_${albumId}`;
  const cachedResult = cache.get(cacheKey);
  if (cachedResult) return cachedResult;

  const result = await fetchFromSaavn(`albums?id=${albumId}`);
  if (result) cache.set(cacheKey, result);
  return result;
};

export const getPodcastDetails = async (podcastId) => {
  const cacheKey = `podcast_${podcastId}`;
  const cachedResult = cache.get(cacheKey);
  if (cachedResult) return cachedResult;

  const result = await fetchFromSaavn(`podcasts?id=${podcastId}`);
  if (result) cache.set(cacheKey, result);
  return result;
};

export const getSongLyrics = async (songId) => {
  const cacheKey = `lyrics_${songId}`;
  const cachedResult = cache.get(cacheKey);
  if (cachedResult) return cachedResult;

  const result = await fetchFromSaavn(`lyrics?id=${songId}`);
  if (result) cache.set(cacheKey, result);
  return result || { error: 'Lyrics not available for this song' };
};

export const getSongStreamingUrl = async (songId) => {
  try {
    const result = await fetchFromSaavn(`songs?id=${songId}`);
    return result?.data?.[0]?.downloadUrl || result?.data?.[0]?.streamingUrl || null;
  } catch (error) {
    console.error(`Error fetching streaming URL for song ID ${songId}:`, error);
    throw new Error('Unable to fetch streaming URL');
  }
};
