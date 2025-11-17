import { View, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useState } from 'react';
import { Link, useRouter } from 'expo-router';

import { Button, Input, Typography } from '@/components/ui';
import { useAuthStore } from '@/stores';

/**
 * Sign In Screen
 *
 * Email/password login with form validation.
 * Integrates with authStore for state management.
 */
export default function SignInScreen() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // TODO: Replace with your actual auth API call
      // Example with Supabase (uncomment after setup):
      // const { mutateAsync } = useSignIn();
      // const result = await mutateAsync({ email, password });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful login
      login(
        {
          id: '1',
          email,
          name: email.split('@')[0],
        },
        'mock-token-123'
      );

      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      setErrors({ email: 'Invalid email or password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Typography variant="h1" center>
              Welcome Back
            </Typography>
            <Typography variant="body" color="textSecondary" center>
              Sign in to continue
            </Typography>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              error={errors.password}
              secureTextEntry
              autoComplete="password"
            />

            <Link href="/(auth)/forgot-password" asChild>
              <Typography variant="bodySmall" color="primary" center>
                Forgot Password?
              </Typography>
            </Link>

            <Button
              title="Sign In"
              onPress={handleSignIn}
              loading={loading}
              fullWidth
            />

            <View style={styles.signUpPrompt}>
              <Typography variant="bodySmall" color="textSecondary">
                Don't have an account?{' '}
              </Typography>
              <Link href="/(auth)/sign-up" asChild>
                <Typography variant="bodySmall" color="primary" bold>
                  Sign Up
                </Typography>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xxl,
  },

  header: {
    marginBottom: theme.spacing.xxl,
    gap: theme.spacing.sm,
  },

  form: {
    gap: theme.spacing.lg,
  },

  signUpPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
}));
