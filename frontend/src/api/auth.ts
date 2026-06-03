import client from './client';
import type { User, LoginRequest, RegisterRequest, AuthTokens, UpdateProfileRequest } from '../types/auth';

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthTokens> => {
    const response = await client.post<AuthTokens>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const response = await client.post<User>('/auth/register', data);
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await client.post<AuthTokens>('/auth/refresh', {
      refreshToken: refreshToken,
    });
    return response.data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await client.post('/auth/logout', { refreshToken: refreshToken });
  },

  getMe: async (): Promise<User> => {
    const response = await client.get<User>('/auth/me');
    return response.data;
  },

  updateMe: async (data: UpdateProfileRequest): Promise<User> => {
    const response = await client.put<User>('/auth/me', data);
    return response.data;
  },
};