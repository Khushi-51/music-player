
// API utility for making requests
const api = {
  baseUrl: '',  // Empty base URL means relative to current domain
  
  // Helper method to handle responses
  async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || data.error || 'API request failed');
    }
    
    return data;
  },
  
  // GET request
  async get(endpoint) {
    const token = localStorage.getItem('token');
    
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers
    });
    
    return this.handleResponse(response);
  },
  
  // POST request
  async post(endpoint, data) {
    const token = localStorage.getItem('token');
    
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    
    return this.handleResponse(response);
  },
  
  // PUT request
  async put(endpoint, data) {
    const token = localStorage.getItem('token');
    
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });
    
    return this.handleResponse(response);
  },
  
  // DELETE request
  async delete(endpoint) {
    const token = localStorage.getItem('token');
    
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers
    });
    
    return this.handleResponse(response);
  }
};
