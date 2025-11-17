import { View, ScrollView, SafeAreaView, Alert } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useRouter } from 'expo-router';

import { Button, Card, Typography } from '@/components/ui';
import { useAuthStore, useAppStore } from '@/stores';
import { clearCache, clearUserData } from '@/lib/storage';

/**
 * Profile Screen
 *
 * User profile and settings with authentication state.
 */
export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { resetApp } = useAppStore();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(tabs)');
          },
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearCache();
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const handleResetApp = () => {
    Alert.alert(
      'Reset App',
      'This will reset all app data and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            clearUserData();
            resetApp();
            logout();
            Alert.alert('Success', 'App reset successfully');
            router.replace('/(tabs)');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {isAuthenticated ? (
          <>
            {/* User Info */}
            <View style={styles.section}>
              <Card variant="elevated">
                <View style={styles.avatarContainer}>
                  <View style={styles.avatar}>
                    <Typography variant="h1" color="primary">
                      {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                    </Typography>
                  </View>
                </View>

                <Typography variant="h2" center>
                  {user?.name || 'User'}
                </Typography>
                <Typography variant="body" color="textSecondary" center>
                  {user?.email}
                </Typography>
              </Card>
            </View>

            {/* Account Actions */}
            <View style={styles.section}>
              <Typography variant="h3">Account</Typography>

              <Card variant="outlined">
                <Button
                  title="Edit Profile"
                  variant="outline"
                  fullWidth
                  onPress={() => Alert.alert('Coming Soon', 'Profile editing not implemented')}
                />
              </Card>

              <Card variant="outlined">
                <Button
                  title="Sign Out"
                  variant="danger"
                  fullWidth
                  onPress={handleSignOut}
                />
              </Card>
            </View>
          </>
        ) : (
          <>
            {/* Not Signed In */}
            <View style={styles.section}>
              <Card variant="elevated">
                <Typography variant="h2" center>
                  Not Signed In
                </Typography>
                <Typography variant="body" color="textSecondary" center>
                  Sign in to access your profile and sync your data
                </Typography>
              </Card>
            </View>

            <View style={styles.section}>
              <Button
                title="Sign In"
                onPress={() => router.push('/(auth)/sign-in')}
                fullWidth
              />
              <Button
                title="Create Account"
                variant="outline"
                onPress={() => router.push('/(auth)/sign-up')}
                fullWidth
              />
            </View>
          </>
        )}

        {/* App Settings */}
        <View style={styles.section}>
          <Typography variant="h3">Settings</Typography>

          <Card variant="outlined">
            <Button
              title="Clear Cache"
              variant="outline"
              fullWidth
              onPress={handleClearCache}
            />
          </Card>

          <Card variant="outlined">
            <Button
              title="Reset App"
              variant="danger"
              fullWidth
              onPress={handleResetApp}
            />
          </Card>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Card variant="filled">
            <Typography variant="caption" color="textMuted" center>
              React Native Template v1.0.0
            </Typography>
            <Typography variant="caption" color="textMuted" center>
              Built with Expo, MMKV, Zustand, TanStack Query & Unistyles
            </Typography>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.xl,
  },

  section: {
    gap: theme.spacing.md,
  },

  avatarContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.background2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
}));
