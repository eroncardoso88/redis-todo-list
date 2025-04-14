const API_URL = 'http://localhost:3000';

export async function logoutUser() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  
  try {
    await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
  } catch (error) {
    console.error('Logout error:', error);
  }
}

export function isAuthenticated() {
  return !!localStorage.getItem('authToken');
}
