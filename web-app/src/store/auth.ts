// 认证状态管理
import { create } from 'zustand';
import { storage } from '../utils/storage';
import { User } from '../types';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  
  // Actions
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  setAuth: (token: string, user: User) => {
    storage.setToken(token);
    storage.setUser(user);
    set({ token, user, isAuthenticated: true });
  },

  clearAuth: () => {
    storage.clearAll();
    set({ token: null, user: null, isAuthenticated: false });
  },

  initAuth: () => {
    const token = storage.getToken();
    const user = storage.getUser();
    if (token && user) {
      set({ token, user, isAuthenticated: true });
    }
  },
}));
