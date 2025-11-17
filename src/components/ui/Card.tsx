import { View, type ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type CardVariant = 'elevated' | 'outlined' | 'filled';

interface CardProps extends Omit<ViewProps, 'style'> {
  /** Visual variant */
  variant?: CardVariant;
  /** Remove padding */
  noPadding?: boolean;
  /** Children components */
  children: React.ReactNode;
}

/**
 * Card Component
 *
 * A container component for content with elevation or borders.
 *
 * Usage:
 * ```tsx
 * <Card variant="elevated">
 *   <Text>Card content</Text>
 * </Card>
 * ```
 */
export function Card({ variant = 'elevated', noPadding = false, children, ...props }: CardProps) {
  return (
    <View style={[styles.base, styles[variant], !noPadding && styles.padding]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  base: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },

  // Variants
  elevated: {
    backgroundColor: theme.colors.card,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  outlined: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filled: {
    backgroundColor: theme.colors.surface,
  },

  // Padding
  padding: {
    padding: theme.spacing.lg,
  },
}));
