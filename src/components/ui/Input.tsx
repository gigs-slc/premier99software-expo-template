import { View, TextInput, Text, type TextInputProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useState } from 'react';

interface InputProps extends TextInputProps {
  /** Input label */
  label?: string;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Container style */
  containerStyle?: any;
}

/**
 * Input Component
 *
 * A styled text input with label, error, and helper text support.
 *
 * Usage:
 * ```tsx
 * <Input
 *   label="Email"
 *   placeholder="Enter your email"
 *   error={errors.email}
 *   value={email}
 *   onChangeText={setEmail}
 * />
 * ```
 */
export function Input({ label, error, helperText, containerStyle, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error && styles.inputError,
          props.editable === false && styles.inputDisabled,
        ]}
        placeholderTextColor={styles.placeholder.color}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
      {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    marginBottom: theme.spacing.md,
  },

  label: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },

  input: {
    ...theme.typography.body,
    backgroundColor: theme.colors.input,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    color: theme.colors.text,
    minHeight: 48,
  },

  inputFocused: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },

  inputError: {
    borderColor: theme.colors.error,
  },

  inputDisabled: {
    backgroundColor: theme.colors.disabled,
    opacity: 0.5,
  },

  placeholder: {
    color: theme.colors.textMuted,
  },

  errorText: {
    ...theme.typography.caption,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },

  helperText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
}));
