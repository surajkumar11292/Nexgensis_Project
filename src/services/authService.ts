import apiClient, { AUTH_TOKEN_KEY, AUTH_USER_KEY } from './api';
import { AuthResponse, LoginCredentials, User } from '@/types/auth';

export const authService = {
  /**
   * Authenticate with username and password.
   * DummyJSON endpoint: POST /auth/login
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      username: credentials.username.trim(),
      password: credentials.password,
      expiresInMins: credentials.expiresInMins || 60,
    });

    const data = response.data;

    // Persist token and user in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_TOKEN_KEY, data.accessToken);
      const user: User = {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        image: data.image,
      };
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    }

    return data;
  },

  /**
   * Fetch current authenticated user's profile.
   * DummyJSON endpoint: GET /auth/me
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  /**
   * Clear local session data upon logout.
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    }
  },

  /**
   * Retrieve cached user and token from localStorage if available.
   */
  getStoredAuth(): { user: User | null; token: string | null } {
    if (typeof window === 'undefined') {
      return { user: null, token: null };
    }
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const userStr = localStorage.getItem(AUTH_USER_KEY);
    let user: User | null = null;
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch {
        user = null;
      }
    }
    return { user, token };
  },
};

export default authService;
