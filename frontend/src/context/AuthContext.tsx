import React, { createContext, useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; first_name: string; last_name: string }) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getApiBaseUrl = () => {
    return import.meta.env.VITE_API_BASE_URL || '/api/v1';
  };

  const fetchCurrentUser = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${getApiBaseUrl()}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUser({
          id: data.id,
          email: data.email,
          first_name: data.firstName || data.first_name,
          last_name: data.lastName || data.last_name,
        });
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    } catch {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${getApiBaseUrl()}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('access_token', data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
    if (data.user) {
      setUser({
        id: data.user.id,
        email: data.user.email,
        first_name: data.user.firstName || data.user.first_name,
        last_name: data.user.lastName || data.user.last_name,
      });
    }
  };

  const register = async (regData: { email: string; password: string; first_name: string; last_name: string }) => {
    const response = await fetch(`${getApiBaseUrl()}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: regData.email,
        password: regData.password,
        firstName: regData.first_name,
        lastName: regData.last_name,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Registration failed');
    }

    const data = await response.json();
    localStorage.setItem('access_token', data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
    if (data.user) {
      setUser({
        id: data.user.id,
        email: data.user.email,
        first_name: data.user.firstName || data.user.first_name,
        last_name: data.user.lastName || data.user.last_name,
      });
    }
  };

  const logout = () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      const token = localStorage.getItem('access_token');
      fetch(`${getApiBaseUrl()}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ refreshToken }),
      }).catch(() => {
        // Ignore errors on logout
      });
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}