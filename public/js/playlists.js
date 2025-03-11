
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login.html?redirect=playlists.html';
    return;
  }
  
  // DOM elements
  const createPlaylistBtn = document.getElementById('create-playlist-btn');
  const createPlaylistForm = document.getElementById('create-playlist-form');
  const playlistForm = document.getElementById('playlist-form');
  const cancelCreateBtn = document.getElementById('cancel-create');
  const playlistsList = document.getElementById('playlists-list');
  const playlistDetail = document.getElementById('playlist-detail');
  const backToPlaylistsBtn = document.getElementById('back-to-playlists');
  const loading = document.getElementById('loading');
  
  // Event listeners
  createPlaylistBtn.addEventListener('click', () => {
    createPlaylistForm.classList.remove('hidden');
  });
  
  cancelCreateBtn.addEventListener('click', () => {
    createPlaylistForm.classList.add('hidden');
    playlistForm.reset();
  });
  
  playlistForm.addEventListener('submit', createPlaylist);
  
  backToPlaylistsBtn.addEventListener('click', () => {
    playlistDetail.classList.add('hidden');
    playlistsList.classList.remove('hidden');
  });
  
  // Load user's playlists
  loadPlaylists();
  
  async function loadPlaylists() {
    try {
      loading.classList.remove('hidden');
      playlistsList.innerHTML = '';
      
      const playlists = await api.get('/api/playlists');
      
      loading.classList.add('hidden');
      
      if (playlists.length === 0) {
        playlistsList.innerHTML = '<p>You don\'t have any playlists yet. Create one to get started!</p>';
        return;
      }
      
      // Display playlists
      playlists.forEach(playlist => {
        const playlistCard = document.createElement('div');
        playlistCard.className = 'playlist-card';
        
        // Default image if none provided
        const coverImage = playlist.coverImage || '/assets/images/placeholder.jpg';
        
        playlistCard.innerHTML = `
          <img src="${coverImage}" alt="${playlist.name}">
          <div class="playlist-info">
            <h3>${playlist.name}</h3>
            <p>${playlist.songs.length} songs</p>
            <button class="btn primary view-playlist-btn" data-id="${playlist._id}">View Playlist</button>
          </div>
        `;
        
        // Add event listener to view button
        playlistCard.querySelector('.view-playlist-btn').addEventListener('click', () => {
          viewPlaylist(playlist._id);
        });
        
        playlistsList.appendChild(playlistCard);
      });
    } catch (error) {
      loading.classList.add('hidden');
      playlistsList.innerHTML = `<p class="error-message">Error: ${error.message || 'Failed to load playlists'}</p>`;
    }
  }
  
  async function createPlaylist(e) {
    e.preventDefault();
    
    const name = document.getElementById('playlist-name').value;
    const description = document.getElementById('playlist-description').value;
    const isPublic = document.getElementById('playlist-public').checked;
    
    try {
      loading.classList.remove('hidden');
      
      await api.post('/api/playlists', {
        name,
        description,
        isPublic
      });
      
      // Reset form and hide it
      playlistForm.reset();
      createPlaylistForm.classList.add('hidden');
      
      // Reload playlists
      loadPlaylists();
    } catch (error) {
      loading.classList.add('hidden');
      alert(`Error creating playlist: ${error.message || 'Unknown error'}`);
    }
  }
  
  async function viewPlaylist(playlistId) {
    try {
      loading.classList.remove('hidden');
      
      const playlist = await api.get(`/api/playlists/${playlistId}`);
      
      loading.classList.add('hidden');
      
      // Update playlist detail view
      document.getElementById('playlist-detail-name').textContent = playlist.name;
      document.getElementById('playlist-detail-description').textContent = playlist.description || 'No description';
      
      const playlistSongs = document.getElementById('playlist-songs');
      playlistSongs.innerHTML = '';
      
      if (playlist.songs.length === 0) {
        playlistSongs.innerHTML = '<p>This playlist is empty. Add songs from the search page.</p>';
      } else {
        // Create a table for songs
        const table = document.createElement('table');
        table.className = 'songs-table';
        
        table.innerHTML = `
          <thead>
            <tr>
              <th>Title</th>
              <th>Artist</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody></tbody>
        `;
        
        const tbody = table.querySelector('tbody');
        
        playlist.songs.forEach((song, index) => {
          const row = document.createElement('tr');
          
          row.innerHTML = `
            <td>${song.title}</td>
            <td>${song.artist}</td>
            <td>
              <button class="btn primary play-btn" data-id="${song.songId}">Play</button>
              <button class="btn secondary remove-btn" data-id="${song.songId}">Remove</button>
            </td>
          `;
          
          // Add event listeners
          row.querySelector('.play-btn').addEventListener('click', () => {
            window.location.href = `/player.html?id=${song.songId}&type=songs`;
          });
          
          row.querySelector('.remove-btn').addEventListener('click', () => {
            removeSongFromPlaylist(playlistId, song.songId);
          });
          
          tbody.appendChild(row);
        });
        
        playlistSongs.appendChild(table);
      }
      
      // Show playlist detail view
      playlistsList.classList.add('hidden');
      playlistDetail.classList.remove('hidden');
    } catch (error) {
      loading.classList.add('hidden');
      alert(`Error loading playlist: ${error.message || 'Unknown error'}`);
    }
  }
  
  async function removeSongFromPlaylist(playlistId, songId) {
    if (!confirm('Are you sure you want to remove this song from the playlist?')) {
      return;
    }
    
    try {
      loading.classList.remove('hidden');
      
      await api.delete(`/api/playlists/${playlistId}/songs/${songId}`);
      
      loading.classList.add('hidden');
      
      // Refresh playlist view
      viewPlaylist(playlistId);
    } catch (error) {
      loading.classList.add('hidden');
      alert(`Error removing song: ${error.message || 'Unknown error'}`);
    }
  }
});
