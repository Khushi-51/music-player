
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on the login page
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // Check if we're on the register page
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
  
  // Check for redirect parameter
  const urlParams = new URLSearchParams(window.location.search);
  const redirect = urlParams.get('redirect');
  
  // Store redirect URL if present
  if (redirect) {
    localStorage.setItem('redirectAfterLogin', redirect);
  }
});

async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('error-message');
  
  try {
    const response = await api.post('/api/auth/login', { email, password });
    
    // Store token and user data
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    // Check if there's a redirect URL
    const redirectUrl = localStorage.getItem('redirectAfterLogin');
    if (redirectUrl) {
      localStorage.removeItem('redirectAfterLogin');
      window.location.href = redirectUrl;
    } else {
      window.location.href = '/';
    }
  } catch (error) {
    errorMessage.textContent = error.message || 'Login failed. Please check your credentials.';
    errorMessage.style.display = 'block';
  }
}

async function handleRegister(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('error-message');
  
  try {
    const response = await api.post('/api/auth/register', { username, email, password });
    
    // Store token and user data
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    // Redirect to home page
    window.location.href = '/';
  } catch (error) {
    errorMessage.textContent = error.message || 'Registration failed. Please try again.';
    errorMessage.style.display = 'block';
  }
}
