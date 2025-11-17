import { Text, type TextProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'body' | 'bodySmall' | 'caption';

interface TypographyProps extends Omit<TextProps, 'style'> {
  /** Typography variant */
  variant?: TypographyVariant;
  /** Text color override */
  color?: 'primary' | 'secondary' | 'text' | 'textSecondary' | 'textMuted' | 'textInverse' | 'error' | 'success';
  /** Center align text */
  center?: boolean;
  /** Bold text */
  bold?: boolean;
  /** Children text */
  children: React.ReactNode;
}

/**
 * Typography Component
 *
 * Consistent text styling across the app.
 *
 * Usage:
 * ```tsx
 * <Typography variant="h1">Main Title</Typography>
 * <Typography variant="body" color="textSecondary">
 *   Body text
 * </Typography>
 * ```
 */
export function Typography({
  variant = 'body',
  color,
  center = false,
  bold = false,
  children,
  ...props
}: TypographyProps) {
  return (
    <Text
      style={[
        styles[variant],
        color && { color: styles[`color_${color}`].color },
        center && styles.center,
        bold && styles.bold,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create((theme) => ({
  // Variants
  h1: {
    ...theme.typography.h1,
    color: theme.colors.text,
  },
  h2: {
    ...theme.typography.h2,
    color: theme.colors.text,
  },
  h3: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  body: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  bodySmall: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
  },
  caption: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },

  // Color overrides
  color_primary: {
    color: theme.colors.primary,
  },
  color_secondary: {
    color: theme.colors.secondary,
  },
  color_text: {
    color: theme.colors.text,
  },
  color_textSecondary: {
    color: theme.colors.textSecondary,
  },
  color_textMuted: {
    color: theme.colors.textMuted,
  },
  color_textInverse: {
    color: theme.colors.textInverse,
  },
  color_error: {
    color: theme.colors.error,
  },
  color_success: {
    color: theme.colors.success,
  },

  // Modifiers
  center: {
    textAlign: 'center',
  },
  bold: {
    fontWeight: '700',
  },
}));
