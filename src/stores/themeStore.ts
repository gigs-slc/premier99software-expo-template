import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { settingsStorage } from '@/lib/storage';

/**
 * MMKV Storage adapter for Zustand persistence
 */
const mmkvStorage: StateStorage = {
  getItem: (name: string): string | null => {
    const value = settingsStorage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string): void => {
    settingsStorage.set(name, value);
  },
  removeItem: (name: string): void => {
    settingsStorage.delete(name);
  },
};

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  // State
  mode: ThemeMode;

  // Actions
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

/**
 * Theme Store
 *
 * Manages app theme preferences with persistence.
 *
 * Usage:
 * ```ts
 * const { mode, setMode, toggleTheme } = useThemeStore();
 * ```
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // Initial state
      mode: 'system',

      // Set theme mode
      setMode: (mode) => set({ mode }),

      // Toggle between light and dark
      toggleTheme: () => {
        const currentMode = get().mode;
        const newMode = currentMode === 'dark' ? 'light' : 'dark';
        set({ mode: newMode });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
