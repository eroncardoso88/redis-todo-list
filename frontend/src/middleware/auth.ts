// src/middleware/auth.ts
import authService from '../services/auth-service';

export async function isAuthenticated(request: Request): Promise<boolean> {
  console.log(`request `, request)
  const cookies = request.headers.entries();
  console.log(`cookies `, cookies)
  return true
}


export function clientSideAuth(redirectToLogin = true): boolean {
  if (typeof window !== 'undefined') {
    const isAuthed = authService.isAuthenticatedFromBoth();
    
    if (!isAuthed && redirectToLogin && !window.location.pathname.startsWith('/login')) {
      if (!sessionStorage.getItem('redirecting')) {
        sessionStorage.setItem('redirecting', 'true');
        const currentPath = window.location.pathname;
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
      return false;
    }
    
    sessionStorage.removeItem('redirecting');
    return isAuthed;
  }
  return false;
}


export async function checkSession(): Promise<boolean> {
  if (typeof window !== 'undefined' && authService.isAuthenticated()) {
    try {
      return await authService.refreshSession();
    } catch (error) {
      console.error('Session check failed:', error);
      return false;
    }
  }
  return false;
}

export function setAuthCookie(token: string): void {
  if (typeof document !== 'undefined') {
    document.cookie = `authToken=${token}; path=/; max-age=86400`; // 1 day
  }
}

// Helper to remove auth cookie when logging out
export function removeAuthCookie(): void {
  if (typeof document !== 'undefined') {
    document.cookie = 'authToken=; path=/; max-age=0';
  }
}