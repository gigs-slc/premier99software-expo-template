import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';

/**
 * Example API functions
 * Replace these with your actual API calls
 */
const api = {
  fetchUsers: async () => {
    // Simulated API call - replace with your actual API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    ];
  },

  fetchUser: async (id: string) => {
    // Simulated API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { id, name: 'John Doe', email: 'john@example.com' };
  },

  createUser: async (data: { name: string; email: string }) => {
    // Simulated API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { id: Date.now().toString(), ...data };
  },

  updateUser: async ({ id, data }: { id: string; data: Partial<{ name: string; email: string }> }) => {
    // Simulated API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { id, ...data };
  },
};

/**
 * Example Query Hook - Fetch all users
 *
 * Usage:
 * ```ts
 * const { data: users, isLoading, error } = useUsers();
 * ```
 */
export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.lists(),
    queryFn: () => api.fetchUsers(),
  });
}

/**
 * Example Query Hook - Fetch single user
 *
 * Usage:
 * ```ts
 * const { data: user, isLoading } = useUser('user-123');
 * ```
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => api.fetchUser(id),
    enabled: !!id, // Only run query if id exists
  });
}

/**
 * Example Mutation Hook - Create user
 *
 * Usage:
 * ```ts
 * const createUser = useCreateUser();
 *
 * const handleCreate = async () => {
 *   try {
 *     const newUser = await createUser.mutateAsync({
 *       name: 'John',
 *       email: 'john@example.com'
 *     });
 *     console.log('Created:', newUser);
 *   } catch (error) {
 *     console.error('Failed:', error);
 *   }
 * };
 * ```
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; email: string }) => api.createUser(data),
    onSuccess: () => {
      // Invalidate and refetch users list after successful creation
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
  });
}

/**
 * Example Mutation Hook - Update user (with optimistic updates)
 *
 * This demonstrates optimistic updates for better UX
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<{ name: string; email: string }> }) =>
      api.updateUser({ id, data }),

    // Optimistic update: Update UI immediately before server responds
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.users.detail(id) });

      // Snapshot previous value
      const previousUser = queryClient.getQueryData(queryKeys.users.detail(id));

      // Optimistically update to the new value
      queryClient.setQueryData(queryKeys.users.detail(id), (old: any) => ({
        ...old,
        ...data,
      }));

      // Return context with previous value
      return { previousUser };
    },

    // On error, roll back to previous value
    onError: (err, { id }, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(queryKeys.users.detail(id), context.previousUser);
      }
    },

    // Always refetch after error or success
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
  });
}
