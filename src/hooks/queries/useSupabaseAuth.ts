/**
 * Supabase Authentication Hooks (Optional)
 *
 * These hooks integrate Supabase auth with TanStack Query and Zustand.
 *
 * To use:
 * 1. Set up Supabase in src/lib/supabase.ts
 * 2. Uncomment the code below
 */

// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { supabase } from '@/lib/supabase';
// import { useAuthStore } from '@/stores';
// import { queryKeys } from '@/lib/queryClient';
//
// /**
//  * Get current Supabase session
//  */
// export function useSupabaseSession() {
//   return useQuery({
//     queryKey: queryKeys.auth.session(),
//     queryFn: async () => {
//       const { data, error } = await supabase.auth.getSession();
//       if (error) throw error;
//       return data.session;
//     },
//   });
// }
//
// /**
//  * Sign in with email and password
//  */
// export function useSignIn() {
//   const queryClient = useQueryClient();
//   const { login } = useAuthStore();
//
//   return useMutation({
//     mutationFn: async ({ email, password }: { email: string; password: string }) => {
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });
//
//       if (error) throw error;
//       return data;
//     },
//     onSuccess: (data) => {
//       if (data.user && data.session) {
//         // Update Zustand store
//         login(
//           {
//             id: data.user.id,
//             email: data.user.email!,
//             name: data.user.user_metadata?.name,
//           },
//           data.session.access_token
//         );
//
//         // Invalidate auth queries
//         queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
//       }
//     },
//   });
// }
//
// /**
//  * Sign up with email and password
//  */
// export function useSignUp() {
//   const queryClient = useQueryClient();
//
//   return useMutation({
//     mutationFn: async ({ email, password, name }: { email: string; password: string; name?: string }) => {
//       const { data, error } = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           data: {
//             name,
//           },
//         },
//       });
//
//       if (error) throw error;
//       return data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
//     },
//   });
// }
//
// /**
//  * Sign out
//  */
// export function useSignOut() {
//   const queryClient = useQueryClient();
//   const { logout } = useAuthStore();
//
//   return useMutation({
//     mutationFn: async () => {
//       const { error } = await supabase.auth.signOut();
//       if (error) throw error;
//     },
//     onSuccess: () => {
//       // Clear auth state
//       logout();
//
//       // Clear all queries
//       queryClient.clear();
//     },
//   });
// }
//
// /**
//  * Reset password
//  */
// export function useResetPassword() {
//   return useMutation({
//     mutationFn: async ({ email }: { email: string }) => {
//       const { error } = await supabase.auth.resetPasswordForEmail(email);
//       if (error) throw error;
//     },
//   });
// }

/**
 * PLACEHOLDER: Uncomment above code after setting up Supabase
 */
export {};
