// src/middleware/auth.ts
import authService from '../services/auth-service';

export async function isAuthenticated(request: Request): Promise<boolean> {
  // const cookies = request.headers.get('cookie');
  // const hasAuthCookie = cookies?.includes('authToken');
  // nao vou implementar um cookie pra isauthenticated
  return true;
}

export function clientSideAuth(redirectToLogin = true): boolean {
  if (typeof window !== 'undefined') {
    const isAuthed = authService.isAuthenticated();
    
    if (!isAuthed && redirectToLogin) {
      const currentPath = window.location.pathname;
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      return false;
    }
    console.log(`isAuthed `, isAuthed)
    return isAuthed;
  }
  return false;
}

export async function checkSession(): Promise<boolean> {
  if (typeof window !== 'undefined' && authService.isAuthenticated()) {
    console.log(`check session?`)
    try {
      return await authService.refreshSession();
    } catch (error) {
      console.error('Session check failed:', error);
      return false;
    }
  }
  return false;
}