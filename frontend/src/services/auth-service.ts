import axios, { AxiosInstance } from 'axios';

export interface User {
  id: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  session_id: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

class AuthService {
  private api: AxiosInstance;
  private baseUrl: string = 'http://localhost:3000';

  constructor() {
    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });
  }

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private getSessionId(): string | null {
    return localStorage.getItem('sessionId');
  }

  private setAuthData(token: string, sessionId: string, user: User): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('sessionId', sessionId);
    localStorage.setItem('user', JSON.stringify(user));
  }

  private clearAuthData(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('user');
  }

  async loginUser(credentials: LoginCredentials): Promise<User> {
    try {
      const loginData = {
        email: credentials.email,
        password: credentials.password
      };

      const response = await this.api.post<AuthResponse>('/auth/login', loginData);
      
      const sessionResponse = await this.api.get(`/auth/session/${response.data.session_id}`, {
        headers: {
          'Authorization': `Bearer ${response.data.access_token}`
        }
      });
      
      const userData: User = sessionResponse.data;
      
      this.setAuthData(
        response.data.access_token,
        response.data.session_id,
        userData
      );
      
      return userData;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error.response?.data?.message || 'Login failed';
    }
  }

  async signupUser(userData: SignupData): Promise<User> {
    try {
      const createUserResponse = await this.api.post('/users', userData);
      
      const loginResponse = await this.loginUser({
        email: userData.email,
        password: userData.password
      });
      
      return loginResponse;
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error.response?.data?.message || 'Signup failed';
    }
  }

  async forgotPassword(email: ForgotPasswordData): Promise<void> {
    try {
      await this.api.post('/auth/forgot-password', email);
    } catch (error: any) {
      console.error('Forgot password error:', error);
      throw error.response?.data?.message || 'Failed to send reset email';
    }
  }

  async logoutUser(): Promise<void> {
    try {
      const sessionId = this.getSessionId();
      if (sessionId) {
        await this.api.delete(`/auth/logout/${sessionId}`);
      }
      this.clearAuthData();
    } catch (error) {
      console.error('Logout error:', error);
      this.clearAuthData();
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getSessionId();
  }

  getCurrentUser(): User | null {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  }

  async refreshSession(): Promise<boolean> {
    try {
      const sessionId = this.getSessionId();
      const token = this.getToken();
      
      if (!sessionId || !token) {
        return false;
      }

      const response = await this.api.get(`/auth/session/${sessionId}`);
      return true;
    } catch (error: any) {
      console.error('Session refresh error:', error);
      if (error.response?.status === 401) {
        this.clearAuthData();
      }
      return false;
    }
  }

  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }
}

export const authService = new AuthService();
export default authService;