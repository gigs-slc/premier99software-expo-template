import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { QueryClientProvider } from '@tanstack/react-query';

import { useColorScheme } from '@/components/useColorScheme';
import { queryClient } from '@/lib/queryClient';
import { useAuthStore } from '@/stores';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Initial route is determined by auth state in RootLayoutNav
  initialRouteName: undefined,
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const [isReady, setIsReady] = useState(false);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Initialize app and check auth state
  useEffect(() => {
    async function prepare() {
      try {
        // Wait for fonts to load
        if (!loaded) return;

        // Give the auth store time to hydrate from MMKV
        // This ensures isAuthenticated is loaded before routing
        await new Promise(resolve => setTimeout(resolve, 100));

        setIsReady(true);
      } catch (e) {
        console.warn('Error during initialization:', e);
        setIsReady(true);
      } finally {
        // Hide splash screen once ready
        if (loaded) {
          SplashScreen.hideAsync();
        }
      }
    }

    prepare();
  }, [loaded]);

  if (!isReady) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated } = useAuthStore();

  /**
   * Authentication Routing Logic
   *
   * This effect handles automatic navigation based on auth state:
   * - Unauthenticated users → Redirect to /(auth)/sign-in
   * - Authenticated users → Redirect to /(tabs)
   *
   * Uses segments to detect current route group to prevent infinite loops
   */
  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!isAuthenticated && !inAuthGroup) {
      // User is not authenticated and not in auth screens → Redirect to login
      router.replace('/(auth)/sign-in');
    } else if (isAuthenticated && inAuthGroup) {
      // User is authenticated but still in auth screens → Redirect to app
      router.replace('/(tabs)');
    } else if (isAuthenticated && !inTabsGroup && !inAuthGroup) {
      // User is authenticated but not in tabs or auth → Redirect to app
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: true }} />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
