
document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const audioPlayer = document.getElementById('audio-player');
  const albumArt = document.getElementById('album-art');
  const songTitle = document.getElementById('song-title');
  const songArtist = document.getElementById('song-artist');
  const songAlbum = document.getElementById('song-album');
  const currentTimeEl = document.getElementById('current-time');
  const durationEl = document.getElementById('duration');
  const progressBar = document.getElementById('progress');
  const playBtn = document.getElementById('play-btn');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const downloadBtn = document.getElementById('download-btn');
  const lyricsBtn = document.getElementById('lyrics-btn');
  const addToPlaylistBtn = document.getElementById('add-to-playlist-btn');
  const lyricsContainer = document.getElementById('lyrics-container');
  const lyricsContent = document.getElementById('lyrics-content');
  const closeLyricsBtn = document.getElementById('close-lyrics');
  
  // Get song ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const songId = urlParams.get('id');
  const type = urlParams.get('type') || 'songs';
  
  // Current song data
  let currentSong = null;
  
  // Check if we have a song ID
  if (!songId) {
    alert('No song selected');
    window.location.href = '/search.html';
    return;
  }
  
  // Load song details
  loadSong(songId);
  
  // Event listeners
  playBtn.addEventListener('click', togglePlay);
  audioPlayer.addEventListener('timeupdate', updateProgress);
  audioPlayer.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audioPlayer.duration);
  });
  audioPlayer.addEventListener('ended', () => {
    playBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36"><path d="M8 5v14l11-7z"/></svg>';
  });
  
  lyricsBtn.addEventListener('click', toggleLyrics);
  closeLyricsBtn.addEventListener('click', () => {
    lyricsContainer.classList.add('hidden');
  });
  
  downloadBtn.addEventListener('click', downloadSong);
  addToPlaylistBtn.addEventListener('click', showPlaylistsModal);
  
  // Functions
  async function loadSong(id) {
    try {
      // Get song details
      const song = await api.get(`/api/search/song/${id}`);
      currentSong = song;
      
      // Update UI with song details
      songTitle.textContent = song.title;
      songArtist.textContent = song.artist;
      songAlbum.textContent = song.album || 'Unknown Album';
      albumArt.src = song.image || '/assets/images/placeholder.jpg';
      
      // Set audio source
      audioPlayer.src = song.downloadUrl || song.streamingUrl;
      
      // Preload audio
      audioPlayer.load();
    } catch (error) {
      alert(`Error loading song: ${error.message || 'Unknown error'}`);
    }
  }
  
  function togglePlay() {
    if (audioPlayer.paused) {
      audioPlayer.play();
      playBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
    } else {
      audioPlayer.pause();
      playBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36"><path d="M8 5v14l11-7z"/></svg>';
    }
  }
  
  function updateProgress() {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    
    // Update time display
    currentTimeEl.textContent = formatTime(currentTime);
    
    // Update progress bar
    if (duration) {
      const progressPercent = (currentTime / duration) * 100;
      progressBar.style.width = `${progressPercent}%`;
    }
  }
  
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
  
  async function toggleLyrics() {
    if (lyricsContainer.classList.contains('hidden')) {
      // Show lyrics
      lyricsContainer.classList.remove('hidden');
      
      // Load lyrics if not already loaded
      if (lyricsContent.innerHTML === '') {
        try {
          const lyrics = await api.get(`/api/lyrics/${songId}`);
          
          if (lyrics.error) {
            lyricsContent.innerHTML = '<p>Lyrics not available for this song.</p>';
          } else {
            // Format lyrics
            const formattedLyrics = lyrics.lyrics.split('\n').map(line => 
              `<div class="lyrics-line">${line}</div>`
            ).join('');
            
            lyricsContent.innerHTML = formattedLyrics;
          }
        } catch (error) {
          lyricsContent.innerHTML = `<p>Error loading lyrics: ${error.message || 'Unknown error'}</p>`;
        }
      }
    } else {
      // Hide lyrics
      lyricsContainer.classList.add('hidden');
    }
  }
  
  async function downloadSong() {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = `/login.html?redirect=player.html?id=${songId}&type=${type}`;
      return;
    }
    
    try {
      const result = await api.get(`/api/downloads/${songId}`);
      
      if (result.success) {
        // Open download in new tab
        window.open(result.download.downloadUrl, '_blank');
      }
    } catch (error) {
      alert(`Error downloading song: ${error.message || 'Unknown error'}`);
    }
  }
  
  function showPlaylistsModal() {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = `/login.html?redirect=player.html?id=${songId}&type=${type}`;
      return;
    }
    
    // For now, just alert. In a real app, you'd show a modal with playlists
    alert('Add to playlist functionality will be implemented here');
  }
});
