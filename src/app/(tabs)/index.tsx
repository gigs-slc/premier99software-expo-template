import { View, ScrollView, SafeAreaView } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Link } from 'expo-router';

import { Button, Card, Typography } from '@/components/ui';
import { useAuthStore } from '@/stores';

/**
 * Home Screen
 *
 * Welcome screen with quick links to main features.
 */
export default function HomeScreen() {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Typography variant="h1">
            Welcome{user?.name ? `, ${user.name}` : ''}!
          </Typography>
          <Typography variant="body" color="textSecondary">
            This is your React Native template with all the essential libraries pre-configured.
          </Typography>
        </View>

        <View style={styles.section}>
          <Typography variant="h3">What's Included</Typography>

          <Card variant="elevated">
            <Typography variant="h3" color="primary">
              🗄️ MMKV Storage
            </Typography>
            <Typography variant="bodySmall" color="textSecondary">
              Fast, encrypted key-value storage with TypeScript support
            </Typography>
          </Card>

          <Card variant="elevated">
            <Typography variant="h3" color="primary">
              🎨 Unistyles
            </Typography>
            <Typography variant="bodySmall" color="textSecondary">
              Powerful theming system with dark mode support
            </Typography>
          </Card>

          <Card variant="elevated">
            <Typography variant="h3" color="primary">
              🐻 Zustand
            </Typography>
            <Typography variant="bodySmall" color="textSecondary">
              Simple state management with MMKV persistence
            </Typography>
          </Card>

          <Card variant="elevated">
            <Typography variant="h3" color="primary">
              🔍 TanStack Query
            </Typography>
            <Typography variant="bodySmall" color="textSecondary">
              Powerful data fetching and caching
            </Typography>
          </Card>

          <Card variant="elevated">
            <Typography variant="h3" color="primary">
              🧭 Expo Router
            </Typography>
            <Typography variant="bodySmall" color="textSecondary">
              File-based routing with native navigation
            </Typography>
          </Card>
        </View>

        <View style={styles.actions}>
          <Typography variant="h3">Get Started</Typography>

          <Link href="/(tabs)/examples" asChild>
            <Button
              title="View Examples"
              variant="primary"
              fullWidth
            />
          </Link>

          {!isAuthenticated && (
            <Link href="/(auth)/sign-in" asChild>
              <Button
                title="Try Authentication"
                variant="outline"
                fullWidth
              />
            </Link>
          )}
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
    gap: theme.spacing.xxl,
  },

  header: {
    gap: theme.spacing.sm,
  },

  section: {
    gap: theme.spacing.md,
  },

  actions: {
    gap: theme.spacing.md,
  },
}));
