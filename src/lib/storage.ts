import { createMMKV, MMKV } from 'react-native-mmkv';

/**
 * MMKV v4 Storage Configuration
 *
 * This file sets up multiple MMKV storage instances for different purposes.
 * Using separate instances helps organize data and allows for different encryption keys.
 */

// Main storage instance for general app data
export const storage = createMMKV({
  id: 'app-storage',
});

// User-specific data storage (can be cleared on logout)
export const userStorage = createMMKV({
  id: 'user-storage',
});

// Cache storage for temporary data
export const cacheStorage = createMMKV({
  id: 'cache-storage',
});

// Settings storage for app preferences
export const settingsStorage = createMMKV({
  id: 'settings-storage',
});

// Secure storage for sensitive data (encrypted)
// NOTE: Replace 'your-encryption-key' with a proper key in production
// Consider using expo-secure-store to generate and store encryption keys
export const secureStorage = createMMKV({
  id: 'secure-storage',
  encryptionKey: process.env.EXPO_PUBLIC_MMKV_ENCRYPTION_KEY || 'default-key-change-in-production',
});

/**
 * Typed storage helpers for common operations
 * These helpers provide type safety and consistent error handling
 */
export const createStorageHelpers = (storageInstance: MMKV) => ({
  // String operations
  getString: (key: string): string | undefined => {
    return storageInstance.getString(key);
  },

  setString: (key: string, value: string): void => {
    storageInstance.set(key, value);
  },

  // Number operations
  getNumber: (key: string): number | undefined => {
    return storageInstance.getNumber(key);
  },

  setNumber: (key: string, value: number): void => {
    storageInstance.set(key, value);
  },

  // Boolean operations
  getBoolean: (key: string): boolean | undefined => {
    return storageInstance.getBoolean(key);
  },

  setBoolean: (key: string, value: boolean): void => {
    storageInstance.set(key, value);
  },

  // Object operations (JSON serialization)
  getObject: <T>(key: string): T | undefined => {
    const jsonString = storageInstance.getString(key);
    if (!jsonString) return undefined;

    try {
      return JSON.parse(jsonString) as T;
    } catch (error) {
      console.error(`Failed to parse JSON for key "${key}":`, error);
      return undefined;
    }
  },

  setObject: <T>(key: string, value: T): void => {
    try {
      storageInstance.set(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to stringify value for key "${key}":`, error);
    }
  },

  // Delete key
  delete: (key: string): void => {
    storageInstance.delete(key);
  },

  // Clear all data
  clearAll: (): void => {
    storageInstance.clearAll();
  },

  // Check if key exists
  contains: (key: string): boolean => {
    return storageInstance.contains(key);
  },

  // Get all keys
  getAllKeys: (): string[] => {
    return storageInstance.getAllKeys();
  },

  // Bulk operations
  getMultiple: (keys: string[]): Record<string, string | undefined> => {
    return keys.reduce((acc, key) => {
      acc[key] = storageInstance.getString(key);
      return acc;
    }, {} as Record<string, string | undefined>);
  },

  setMultiple: (entries: Record<string, string | number | boolean>): void => {
    Object.entries(entries).forEach(([key, value]) => {
      storageInstance.set(key, value);
    });
  },
});

// Export helper instances for each storage
export const storageHelpers = createStorageHelpers(storage);
export const userStorageHelpers = createStorageHelpers(userStorage);
export const cacheStorageHelpers = createStorageHelpers(cacheStorage);
export const settingsStorageHelpers = createStorageHelpers(settingsStorage);
export const secureStorageHelpers = createStorageHelpers(secureStorage);

/**
 * Storage keys constants
 * Centralizing keys helps prevent typos and makes refactoring easier
 */
export const STORAGE_KEYS = {
  // Auth
  AUTH_TOKEN: 'auth.token',
  REFRESH_TOKEN: 'auth.refreshToken',
  USER_ID: 'auth.userId',

  // User preferences
  THEME_MODE: 'preferences.themeMode',
  LANGUAGE: 'preferences.language',
  NOTIFICATIONS_ENABLED: 'preferences.notificationsEnabled',

  // App state
  ONBOARDING_COMPLETED: 'app.onboardingCompleted',
  LAST_APP_VERSION: 'app.lastVersion',

  // Cache
  CACHE_TIMESTAMP: 'cache.timestamp',
} as const;

/**
 * Utility function to clear all user data (useful for logout)
 */
export const clearUserData = (): void => {
  userStorage.clearAll();
  secureStorage.clearAll();

  // Clear auth-related keys from main storage
  storage.delete(STORAGE_KEYS.AUTH_TOKEN);
  storage.delete(STORAGE_KEYS.REFRESH_TOKEN);
  storage.delete(STORAGE_KEYS.USER_ID);
};

/**
 * Utility function to clear all cache
 */
export const clearCache = (): void => {
  cacheStorage.clearAll();
};
