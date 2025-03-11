
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const searchType = document.getElementById('search-type');
  const searchButton = document.getElementById('search-button');
  const searchResults = document.getElementById('search-results');
  const loading = document.getElementById('loading');
  
  // Add event listeners
  searchButton.addEventListener('click', performSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  });
  
  async function performSearch() {
    const query = searchInput.value.trim();
    const type = searchType.value;
    
    if (!query) return;
    
    // Show loading spinner
    searchResults.innerHTML = '';
    loading.classList.remove('hidden');
    
    try {
      const results = await api.get(`/api/search?q=${encodeURIComponent(query)}&type=${type}`);
      
      // Hide loading spinner
      loading.classList.add('hidden');
      
      // Display results
      displayResults(results, type);
    } catch (error) {
      loading.classList.add('hidden');
      searchResults.innerHTML = `<p class="error-message">Error: ${error.message || 'Failed to perform search'}</p>`;
    }
  }
  
  function displayResults(data, type) {
    if (!data.results || data.results.length === 0) {
      searchResults.innerHTML = '<p>No results found. Try a different search term.</p>';
      return;
    }
    
    // Clear previous results
    searchResults.innerHTML = '';
    
    // Create result cards
    data.results.forEach(item => {
      const card = document.createElement('div');
      card.className = 'result-card';
      
      // Determine image and details based on result type
      let image = item.image || '/assets/images/placeholder.jpg';
      let title = item.title || item.name;
      let subtitle = '';
      
      switch (type) {
        case 'songs':
          subtitle = item.artist;
          break;
        case 'albums':
          subtitle = item.artist;
          break;
        case 'playlists':
          subtitle = `${item.songCount || 0} songs`;
          break;
        case 'podcasts':
          subtitle = item.artist || item.creator;
          break;
      }
      
      card.innerHTML = `
        <img src="${image}" alt="${title}">
        <div class="result-info">
          <h3>${title}</h3>
          <p>${subtitle}</p>
        </div>
        <div class="result-actions">
          <button class="btn primary play-btn" data-id="${item.id}" data-type="${type}">Play</button>
          <button class="btn secondary add-btn" data-id="${item.id}" data-type="${type}">Add</button>
        </div>
      `;
      
      // Add event listeners to buttons
      card.querySelector('.play-btn').addEventListener('click', () => {
        playItem(item.id, type);
      });
      
      card.querySelector('.add-btn').addEventListener('click', () => {
        addToPlaylist(item.id, type);
      });
      
      searchResults.appendChild(card);
    });
  }
  
  function playItem(id, type) {
    // Redirect to player page with item ID and type
    window.location.href = `/player.html?id=${id}&type=${type}`;
  }
  
  function addToPlaylist(id, type) {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login.html?redirect=search.html';
      return;
    }
    
    // For now, just alert. In a real app, you'd show a modal to select a playlist
    alert('Add to playlist functionality will be implemented here');
  }
});
