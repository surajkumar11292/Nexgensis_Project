'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContextType, LoginCredentials, User } from '@/types/auth';
import authService from '@/services/authService';
import { AUTH_UNAUTHORIZED_EVENT } from '@/services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper for hydration-safe client-side check
const emptySubscribe = () => () => {};
const getIsClient = () => true;
const getIsServer = () => false;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isClient = useSyncExternalStore(emptySubscribe, getIsClient, getIsServer);
  const router = useRouter();

  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      return authService.getStoredAuth().user;
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return authService.getStoredAuth().token;
    }
    return null;
  });

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setToken(null);
    router.push('/login');
  }, [router]);

  // Listen to 401 unauthorized events dispatched by Axios interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, [logout]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const data = await authService.login(credentials);
      const authenticatedUser: User = {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        image: data.image,
      };
      setUser(authenticatedUser);
      setToken(data.accessToken);
      router.push('/products');
    },
    [router]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading: !isClient,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
