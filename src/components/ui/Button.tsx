import { Pressable, Text, ActivityIndicator, type PressableProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  /** Button text */
  title: string;
  /** Visual variant */
  variant?: ButtonVariant;
  /** Size variant */
  size?: ButtonSize;
  /** Show loading spinner */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Full width button */
  fullWidth?: boolean;
}

/**
 * Button Component
 *
 * A customizable button component with multiple variants and states.
 *
 * Usage:
 * ```tsx
 * <Button
 *   title="Click me"
 *   variant="primary"
 *   onPress={() => console.log('pressed')}
 * />
 * ```
 */
export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onPress,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? styles[variant].color : styles[variant].textColor}
        />
      ) : (
        <Text
          style={[
            styles.text,
            styles[`${size}Text`],
            { color: variant === 'outline' || variant === 'ghost' ? styles[variant].color : styles[variant].textColor },
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
  },

  // Variants
  primary: {
    backgroundColor: theme.colors.primary,
    textColor: theme.colors.onPrimary,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
    textColor: theme.colors.onSecondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    color: theme.colors.primary,
    textColor: theme.colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
    color: theme.colors.primary,
    textColor: theme.colors.primary,
  },
  danger: {
    backgroundColor: theme.colors.error,
    textColor: theme.colors.onError,
  },

  // Sizes
  sm: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 36,
  },
  md: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    minHeight: 44,
  },
  lg: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    minHeight: 52,
  },

  // Text styles
  text: {
    ...theme.typography.button,
    textAlign: 'center',
  },
  smText: {
    fontSize: 14,
  },
  mdText: {
    fontSize: 16,
  },
  lgText: {
    fontSize: 18,
  },

  // States
  disabled: {
    backgroundColor: theme.colors.disabled,
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
  fullWidth: {
    width: '100%',
  },
}));
