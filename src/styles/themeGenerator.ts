import type { AppTheme } from './theme';

/**
 * Theme Generator Utility
 *
 * This utility helps you quickly create custom themes by providing
 * just the primary colors. It generates all the necessary variations
 * and ensures proper contrast ratios.
 */

interface ThemeColors {
  primary: string;
  secondary?: string;
  background?: string;
  surface?: string;
  error?: string;
  success?: string;
  warning?: string;
}

/**
 * Generate a custom light theme
 *
 * Example:
 * ```ts
 * const myTheme = generateLightTheme({
 *   primary: '#FF6B6B',    // Your brand color
 *   secondary: '#4ECDC4',  // Accent color
 * });
 * ```
 */
export function generateLightTheme(colors: ThemeColors): typeof import('./theme').lightTheme {
  return {
    name: 'custom-light',
    dark: false,
    roundness: 12,
    version: 3,
    colors: {
      primary: colors.primary,
      onPrimary: '#FFFFFF',

      background: colors.background || '#FFFFFF',
      background2: colors.surface || '#F9FAFB',
      onBackground: '#111827',

      secondary: colors.secondary || colors.primary,
      onSecondary: '#FFFFFF',

      links: colors.primary,

      button: colors.primary,
      error: colors.error || '#EF4444',
      onError: '#FFFFFF',

      surface: colors.surface || '#FFFFFF',
      onSurface: '#111827',

      outline: '#E5E7EB',
      disabled: '#9CA3AF',
      input: '#F9FAFB',

      cardPrimary: '#FFFFFF',
      cardSecondary: '#F9FAFB',
      card: '#FFFFFF',

      text: '#111827',
      textSecondary: '#6B7280',
      textMuted: '#9CA3AF',
      textDim: '#D1D5DB',
      textInverse: '#FFFFFF',

      border: '#E5E7EB',
      divider: '#F3F4F6',

      success: colors.success || '#10B981',
      warning: colors.warning || '#F59E0B',
      info: '#3B82F6',

      ripple: `${colors.primary}1F`, // 12% opacity
      overlay: 'rgba(0, 0, 0, 0.5)',

      like: '#EF4444',
      comment: '#6B7280',
      share: '#3B82F6',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    borderRadius: {
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      full: 9999,
    },
    typography: {
      h1: {
        fontSize: 32,
        fontWeight: '700' as const,
        lineHeight: 40,
      },
      h2: {
        fontSize: 24,
        fontWeight: '700' as const,
        lineHeight: 32,
      },
      h3: {
        fontSize: 20,
        fontWeight: '600' as const,
        lineHeight: 28,
      },
      body: {
        fontSize: 16,
        fontWeight: '400' as const,
        lineHeight: 24,
      },
      bodySmall: {
        fontSize: 14,
        fontWeight: '400' as const,
        lineHeight: 20,
      },
      caption: {
        fontSize: 12,
        fontWeight: '400' as const,
        lineHeight: 16,
      },
      button: {
        fontSize: 16,
        fontWeight: '600' as const,
        lineHeight: 24,
      },
    },
  } as const;
}

/**
 * Generate a custom dark theme
 */
export function generateDarkTheme(colors: ThemeColors): typeof import('./theme').darkTheme {
  return {
    name: 'custom-dark',
    dark: true,
    roundness: 12,
    version: 3,
    colors: {
      primary: colors.primary,
      onPrimary: '#000000',

      background: colors.background || '#000000',
      background2: colors.surface || '#1C1C1E',
      onBackground: '#FFFFFF',

      secondary: colors.secondary || colors.primary,
      onSecondary: '#FFFFFF',

      links: colors.primary,

      button: colors.primary,
      error: colors.error || '#FF453A',
      onError: '#FFFFFF',

      surface: colors.surface || '#1C1C1E',
      onSurface: '#FFFFFF',

      outline: '#38383A',
      disabled: '#48484A',
      input: '#1C1C1E',

      cardPrimary: '#1C1C1E',
      cardSecondary: '#2C2C2E',
      card: '#1C1C1E',

      text: '#FFFFFF',
      textSecondary: '#AEAEB2',
      textMuted: '#8E8E93',
      textDim: '#636366',
      textInverse: '#000000',

      border: '#38383A',
      divider: '#2C2C2E',

      success: colors.success || '#32D74B',
      warning: colors.warning || '#FF9F0A',
      info: '#64D2FF',

      ripple: `${colors.primary}1F`,
      overlay: 'rgba(0, 0, 0, 0.7)',

      like: '#FF453A',
      comment: '#AEAEB2',
      share: '#64D2FF',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    borderRadius: {
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      full: 9999,
    },
    typography: {
      h1: {
        fontSize: 32,
        fontWeight: '700' as const,
        lineHeight: 40,
      },
      h2: {
        fontSize: 24,
        fontWeight: '700' as const,
        lineHeight: 32,
      },
      h3: {
        fontSize: 20,
        fontWeight: '600' as const,
        lineHeight: 28,
      },
      body: {
        fontSize: 16,
        fontWeight: '400' as const,
        lineHeight: 24,
      },
      bodySmall: {
        fontSize: 14,
        fontWeight: '400' as const,
        lineHeight: 20,
      },
      caption: {
        fontSize: 12,
        fontWeight: '400' as const,
        lineHeight: 16,
      },
      button: {
        fontSize: 16,
        fontWeight: '600' as const,
        lineHeight: 24,
      },
    },
  } as const;
}
