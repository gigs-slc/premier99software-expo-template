import { View, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useState } from 'react';
import { useRouter } from 'expo-router';

import { Button, Input, Typography } from '@/components/ui';

/**
 * Forgot Password Screen
 *
 * Password reset request with email validation.
 */
export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email');
      return false;
    }
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateEmail()) return;

    setLoading(true);

    try {
      // TODO: Replace with your actual password reset API call
      // Example with Supabase (uncomment after setup):
      // const { mutateAsync } = useResetPassword();
      // await mutateAsync({ email });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    router.back();
  };

  if (success) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.successContent}>
            <Typography variant="h2" center>
              Check Your Email
            </Typography>
            <Typography variant="body" color="textSecondary" center>
              We've sent password reset instructions to {email}
            </Typography>
          </View>

          <Button
            title="Back to Sign In"
            onPress={handleBackToSignIn}
            fullWidth
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Typography variant="h1" center>
              Reset Password
            </Typography>
            <Typography variant="body" color="textSecondary" center>
              Enter your email and we'll send you instructions to reset your password
            </Typography>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError('');
              }}
              error={error}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <Button
              title="Send Reset Link"
              onPress={handleResetPassword}
              loading={loading}
              fullWidth
            />

            <Button
              title="Back to Sign In"
              variant="ghost"
              onPress={handleBackToSignIn}
              fullWidth
            />
          </View>
        </View>
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

  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xxl,
    justifyContent: 'space-between',
    paddingBottom: theme.spacing.lg,
  },

  header: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xxl,
  },

  form: {
    gap: theme.spacing.lg,
  },

  successContent: {
    flex: 1,
    justifyContent: 'center',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
  },
}));
