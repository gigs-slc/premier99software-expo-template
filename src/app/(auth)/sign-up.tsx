import { View, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useState } from 'react';
import { Link, useRouter } from 'expo-router';

import { Button, Input, Typography } from '@/components/ui';
import { useAuthStore } from '@/stores';

/**
 * Sign Up Screen
 *
 * User registration with form validation.
 */
export default function SignUpScreen() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // TODO: Replace with your actual auth API call
      // Example with Supabase (uncomment after setup):
      // const { mutateAsync } = useSignUp();
      // const result = await mutateAsync({ email, password, name });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock successful registration and auto-login
      login(
        {
          id: Date.now().toString(),
          email,
          name,
        },
        'mock-token-456'
      );

      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      setErrors({ email: 'This email is already registered' });
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
              Create Account
            </Typography>
            <Typography variant="body" color="textSecondary" center>
              Sign up to get started
            </Typography>
          </View>

          <View style={styles.form}>
            <Input
              label="Name"
              placeholder="Enter your name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              error={errors.name}
              autoCapitalize="words"
              autoComplete="name"
            />

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
              placeholder="Create a password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              error={errors.password}
              secureTextEntry
              autoComplete="password-new"
              helperText="Minimum 8 characters"
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              error={errors.confirmPassword}
              secureTextEntry
              autoComplete="password-new"
            />

            <Button
              title="Sign Up"
              onPress={handleSignUp}
              loading={loading}
              fullWidth
            />

            <View style={styles.signInPrompt}>
              <Typography variant="bodySmall" color="textSecondary">
                Already have an account?{' '}
              </Typography>
              <Link href="/(auth)/sign-in" asChild>
                <Typography variant="bodySmall" color="primary" bold>
                  Sign In
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

  signInPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
}));
