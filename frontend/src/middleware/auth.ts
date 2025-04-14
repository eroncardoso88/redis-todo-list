export async function isAuthenticated(request: Request) {
  const cookies = request.headers.get('cookie');
  return cookies?.includes('authToken');
}

export function clientSideAuth() {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (!token) {
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      return false;
    }
    return true;
  }
  return false;
}