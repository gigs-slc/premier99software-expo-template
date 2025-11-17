import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { secureStorage, STORAGE_KEYS, clearUserData } from '@/lib/storage';

/**
 * MMKV Storage adapter for Zustand persistence
 * This allows Zustand to use MMKV as its storage backend
 */
const mmkvStorage: StateStorage = {
  getItem: (name: string): string | null => {
    const value = secureStorage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string): void => {
    secureStorage.set(name, value);
  },
  removeItem: (name: string): void => {
    secureStorage.delete(name);
  },
};

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

/**
 * Authentication Store
 *
 * Manages user authentication state with secure persistence.
 * Data is stored in encrypted MMKV storage.
 *
 * Usage:
 * ```ts
 * const { user, isAuthenticated, login, logout } = useAuthStore();
 * ```
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Set user
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      // Set token
      setToken: (token) =>
        set({ token }),

      // Login action
      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        }),

      // Logout action
      logout: () => {
        // Clear all user data from MMKV
        clearUserData();

        // Reset auth state
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      // Update user profile
      updateUser: (updates) => {
        const currentUser = get().user;
        if (!currentUser) return;

        set({
          user: { ...currentUser, ...updates },
        });
      },
    }),
    {
      name: 'auth-storage', // Key in MMKV
      storage: createJSONStorage(() => mmkvStorage),
      // Only persist these fields (don't persist isLoading)
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
