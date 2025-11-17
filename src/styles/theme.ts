/**
 * Theme Configuration
 *
 * This is a neutral, minimal theme that's easy to customize.
 * To customize colors for your app:
 * 1. Change the primary color to match your brand
 * 2. Adjust secondary/accent colors as needed
 * 3. Modify spacing/typography if required
 *
 * For pre-made themes, check src/styles/presets/
 */

export const lightTheme = {
  name: 'light',
  dark: false,
  roundness: 12,
  version: 3,
  colors: {
    // Main brand colors - CUSTOMIZE THESE FOR YOUR APP
    primary: '#007AFF',        // iOS-style blue
    onPrimary: '#FFFFFF',

    background: '#FFFFFF',     // Clean white background
    background2: '#F9FAFB',    // Subtle gray for sections
    onBackground: '#111827',

    secondary: '#6366F1',      // Indigo accent
    onSecondary: '#FFFFFF',

    links: '#007AFF',

    button: '#007AFF',
    error: '#EF4444',
    onError: '#FFFFFF',

    surface: '#FFFFFF',        // Cards and elevated surfaces
    onSurface: '#111827',

    outline: '#E5E7EB',
    disabled: '#9CA3AF',
    input: '#F9FAFB',

    cardPrimary: '#FFFFFF',
    cardSecondary: '#F9FAFB',
    card: '#FFFFFF',

    text: '#111827',           // Dark text on light background
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    textDim: '#D1D5DB',
    textInverse: '#FFFFFF',

    border: '#E5E7EB',
    divider: '#F3F4F6',

    // Status Colors
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',

    // Interaction States
    ripple: 'rgba(0, 122, 255, 0.12)',
    overlay: 'rgba(0, 0, 0, 0.5)',

    // Social Features
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
} as const

export const darkTheme = {
  name: 'dark',
  dark: true,
  roundness: 12,
  version: 3,
  colors: {
    // Main brand colors - Adjusted for dark mode
    primary: '#0A84FF',        // Brighter blue for dark backgrounds
    onPrimary: '#000000',

    background: '#000000',     // True black for OLED
    background2: '#1C1C1E',    // Dark gray for sections
    onBackground: '#FFFFFF',

    secondary: '#5E5CE6',      // Purple accent
    onSecondary: '#FFFFFF',

    links: '#0A84FF',

    button: '#0A84FF',
    error: '#FF453A',
    onError: '#FFFFFF',

    surface: '#1C1C1E',        // Elevated surfaces
    onSurface: '#FFFFFF',

    outline: '#38383A',
    disabled: '#48484A',
    input: '#1C1C1E',

    cardPrimary: '#1C1C1E',
    cardSecondary: '#2C2C2E',
    card: '#1C1C1E',

    text: '#FFFFFF',           // White text on dark background
    textSecondary: '#AEAEB2',
    textMuted: '#8E8E93',
    textDim: '#636366',
    textInverse: '#000000',

    border: '#38383A',
    divider: '#2C2C2E',

    // Status Colors
    success: '#32D74B',
    warning: '#FF9F0A',
    info: '#64D2FF',

    // Interaction States
    ripple: 'rgba(10, 132, 255, 0.12)',
    overlay: 'rgba(0, 0, 0, 0.7)',

    // Social Features
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
} as const

export type AppTheme = typeof lightTheme
