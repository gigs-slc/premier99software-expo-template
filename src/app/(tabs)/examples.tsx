import { View, ScrollView, SafeAreaView, Switch } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useState } from 'react';

import { Button, Card, Input, Typography } from '@/components/ui';
import { useAppStore, useThemeStore } from '@/stores';
import { storageHelpers } from '@/lib/storage';
import { useUsers, useCreateUser } from '@/hooks/queries/useExampleQuery';

/**
 * Examples Screen
 *
 * Demonstrates usage of all template libraries:
 * - MMKV Storage
 * - Zustand State Management
 * - TanStack Query
 * - Unistyles Theming
 */
export default function ExamplesScreen() {
  // MMKV Storage Example
  const [storageValue, setStorageValue] = useState(
    storageHelpers.getString('example-key') || ''
  );

  const handleStorageSave = () => {
    storageHelpers.setString('example-key', storageValue);
    alert('Value saved to MMKV storage!');
  };

  // Zustand Example
  const { notificationsEnabled, setNotificationsEnabled } = useAppStore();
  const { mode, toggleTheme } = useThemeStore();

  // TanStack Query Example
  const { data: users, isLoading, refetch } = useUsers();
  const createUser = useCreateUser();

  const handleCreateUser = async () => {
    try {
      await createUser.mutateAsync({
        name: 'New User',
        email: 'newuser@example.com',
      });
      alert('User created successfully!');
    } catch (error) {
      alert('Failed to create user');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* MMKV Storage Example */}
        <View style={styles.section}>
          <Typography variant="h2">MMKV Storage</Typography>
          <Card>
            <Typography variant="bodySmall" color="textSecondary">
              Fast, encrypted key-value storage
            </Typography>

            <Input
              label="Test Value"
              placeholder="Enter a value"
              value={storageValue}
              onChangeText={setStorageValue}
            />

            <Button
              title="Save to Storage"
              onPress={handleStorageSave}
              size="sm"
            />

            <Typography variant="caption" color="textMuted">
              Value will persist across app restarts
            </Typography>
          </Card>
        </View>

        {/* Zustand State Example */}
        <View style={styles.section}>
          <Typography variant="h2">Zustand State</Typography>
          <Card>
            <Typography variant="bodySmall" color="textSecondary">
              Global state with MMKV persistence
            </Typography>

            <View style={styles.row}>
              <View style={styles.rowText}>
                <Typography variant="body">Notifications</Typography>
                <Typography variant="caption" color="textSecondary">
                  State persists automatically
                </Typography>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View style={styles.rowText}>
                <Typography variant="body">Theme: {mode}</Typography>
                <Typography variant="caption" color="textSecondary">
                  Toggle between light/dark
                </Typography>
              </View>
              <Button
                title="Toggle"
                onPress={toggleTheme}
                size="sm"
                variant="outline"
              />
            </View>
          </Card>
        </View>

        {/* TanStack Query Example */}
        <View style={styles.section}>
          <Typography variant="h2">TanStack Query</Typography>
          <Card>
            <Typography variant="bodySmall" color="textSecondary">
              Data fetching with caching and mutations
            </Typography>

            {isLoading ? (
              <Typography variant="body" color="textMuted">
                Loading users...
              </Typography>
            ) : (
              <>
                <Typography variant="body">
                  Fetched {users?.length || 0} users
                </Typography>

                <View style={styles.buttonRow}>
                  <Button
                    title="Refetch"
                    onPress={() => refetch()}
                    size="sm"
                    variant="outline"
                  />
                  <Button
                    title="Create User"
                    onPress={handleCreateUser}
                    size="sm"
                    loading={createUser.isPending}
                  />
                </View>

                <Typography variant="caption" color="textMuted">
                  Demonstrates queries and mutations
                </Typography>
              </>
            )}
          </Card>
        </View>

        {/* Unistyles Theme Example */}
        <View style={styles.section}>
          <Typography variant="h2">Unistyles Theme</Typography>
          <Card>
            <Typography variant="bodySmall" color="textSecondary">
              Consistent styling with theme support
            </Typography>

            <View style={styles.colorGrid}>
              <View style={[styles.colorBox, styles.primaryBox]}>
                <Typography variant="caption" center color="textInverse">
                  Primary
                </Typography>
              </View>
              <View style={[styles.colorBox, styles.secondaryBox]}>
                <Typography variant="caption" center color="textInverse">
                  Secondary
                </Typography>
              </View>
              <View style={[styles.colorBox, styles.successBox]}>
                <Typography variant="caption" center color="textInverse">
                  Success
                </Typography>
              </View>
              <View style={[styles.colorBox, styles.errorBox]}>
                <Typography variant="caption" center color="textInverse">
                  Error
                </Typography>
              </View>
            </View>

            <Typography variant="caption" color="textMuted">
              Theme colors automatically adapt to dark mode
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

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.md,
  },

  rowText: {
    flex: 1,
    gap: theme.spacing.xs,
  },

  divider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginVertical: theme.spacing.sm,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },

  colorBox: {
    flex: 1,
    minWidth: 70,
    height: 60,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },

  primaryBox: {
    backgroundColor: theme.colors.primary,
  },

  secondaryBox: {
    backgroundColor: theme.colors.secondary,
  },

  successBox: {
    backgroundColor: theme.colors.success,
  },

  errorBox: {
    backgroundColor: theme.colors.error,
  },
}));
