/**
 * Supabase Configuration (Optional)
 *
 * This file sets up Supabase for authentication and database access.
 *
 * To use Supabase:
 * 1. Install dependencies: npm install @supabase/supabase-js
 * 2. Add your credentials to .env:
 *    - EXPO_PUBLIC_SUPABASE_URL
 *    - EXPO_PUBLIC_SUPABASE_ANON_KEY
 * 3. Uncomment the code below
 */

// import { createClient } from '@supabase/supabase-js';
// import { storage } from './storage';
//
// const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
// const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
//
// if (!supabaseUrl || !supabaseAnonKey) {
//   console.warn('Supabase credentials not found. Please add them to your .env file.');
// }
//
// /**
//  * Custom storage adapter for Supabase using MMKV
//  * This ensures auth tokens are stored in fast, encrypted MMKV storage
//  */
// const MMKVStorage = {
//   getItem: (key: string) => {
//     return storage.getString(key) ?? null;
//   },
//   setItem: (key: string, value: string) => {
//     storage.set(key, value);
//   },
//   removeItem: (key: string) => {
//     storage.delete(key);
//   },
// };
//
// /**
//  * Supabase Client
//  *
//  * Configured with MMKV storage for auth persistence
//  */
// export const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
//   auth: {
//     storage: MMKVStorage,
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: false,
//   },
// });

/**
 * PLACEHOLDER: Uncomment above code and install @supabase/supabase-js to use Supabase
 */
export const supabaseEnabled = false;

// Placeholder export to prevent import errors
export const supabase = null;
