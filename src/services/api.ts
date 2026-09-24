import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

export const AUTH_TOKEN_KEY = 'nexgensis_auth_token';
export const AUTH_USER_KEY = 'nexgensis_auth_user';
export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized';

/**
 * Shared Axios client configured with base URL, authentication interceptor,
 * and centralized error handling.
 */
export const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach bearer token to every outgoing request if present
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors centrally (including 401 unauthorized handling)
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (typeof window !== 'undefined') {
      // 401 Unauthorized handling: dispatch global event for AuthProvider to handle cleanly
      if (error.response?.status === 401) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
        window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT));
      }
    }

    // Extract cleanest error message
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';

    return Promise.reject(new Error(message));
  }
);

export default apiClient;
