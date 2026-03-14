import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (userData, token, refreshToken) => set({
        user: userData,
        token: token,
        refreshToken: refreshToken,
        isAuthenticated: true,
      }),

      setTokens: (token, refreshToken) => set({
        token,
        refreshToken,
        isAuthenticated: true,
      }),

      logout: () => set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
      }),

      updateProfile: (userData) => set((state) => ({
        user: { ...state.user, ...userData },
      })),
    }),
    {
      name: 'auth-storage',
    }
  )
);
