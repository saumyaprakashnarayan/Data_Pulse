import { api } from './api';
import type { LoginResponse } from '../types/auth';

export const authService = {
  async login(email: string, password: string) {
    const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
    return data;
  },

  async logout() {
    await api.post('/auth/logout');
  },

  async register(payload: {
    email: string;
    password: string;
    role?: 'admin' | 'user';
    customerId?: string;
    customerName?: string;
  }) {
    const { data } = await api.post('/register', payload);
    return data;
  },
};
