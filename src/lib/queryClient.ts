import { QueryClient } from '@tanstack/react-query';

/**
 * TanStack Query Client Configuration
 *
 * Configured with optimal defaults for React Native:
 * - Retry logic for network failures
 * - Stale time to reduce unnecessary refetches
 * - Cache time for data persistence
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry failed requests (useful for flaky network connections)
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Stale time: Data is fresh for 5 minutes
      staleTime: 5 * 60 * 1000, // 5 minutes

      // Cache time: Unused data stays in cache for 10 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)

      // Refetch on window focus (tab switching)
      refetchOnWindowFocus: false,

      // Refetch on mount
      refetchOnMount: true,

      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
    },
  },
});

/**
 * Query keys factory
 * Centralized query keys help with cache invalidation and prevent typos
 */
export const queryKeys = {
  // Auth queries
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },

  // User queries
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },

  // Add more query keys for your app's entities
  // Example structure:
  // posts: {
  //   all: ['posts'] as const,
  //   lists: () => [...queryKeys.posts.all, 'list'] as const,
  //   list: (filters: Record<string, unknown>) =>
  //     [...queryKeys.posts.lists(), filters] as const,
  //   details: () => [...queryKeys.posts.all, 'detail'] as const,
  //   detail: (id: string) => [...queryKeys.posts.details(), id] as const,
  // },
};
