import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { storage } from '@/lib/storage';

/**
 * MMKV Storage adapter for Zustand persistence
 */
const mmkvStorage: StateStorage = {
  getItem: (name: string): string | null => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string): void => {
    storage.set(name, value);
  },
  removeItem: (name: string): void => {
    storage.delete(name);
  },
};

interface AppState {
  // State
  hasCompletedOnboarding: boolean;
  lastAppVersion: string | null;
  notificationsEnabled: boolean;

  // Actions
  completeOnboarding: () => void;
  setAppVersion: (version: string) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  resetApp: () => void;
}

/**
 * App Store
 *
 * Manages general app state and preferences.
 *
 * Usage:
 * ```ts
 * const { hasCompletedOnboarding, completeOnboarding } = useAppStore();
 * ```
 */
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      hasCompletedOnboarding: false,
      lastAppVersion: null,
      notificationsEnabled: true,

      // Complete onboarding
      completeOnboarding: () =>
        set({ hasCompletedOnboarding: true }),

      // Set app version
      setAppVersion: (version) =>
        set({ lastAppVersion: version }),

      // Toggle notifications
      setNotificationsEnabled: (enabled) =>
        set({ notificationsEnabled: enabled }),

      // Reset app state
      resetApp: () =>
        set({
          hasCompletedOnboarding: false,
          lastAppVersion: null,
          notificationsEnabled: true,
        }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
