# Complete Feature Documentation

This document provides a comprehensive overview of everything included in this React Native/Expo template and how to use each feature.

---

## Table of Contents

1. [Core Technologies](#core-technologies)
2. [Storage System](#storage-system)
3. [State Management](#state-management)
4. [Data Fetching](#data-fetching)
5. [Styling & Theming](#styling--theming)
6. [UI Component Library](#ui-component-library)
7. [Authentication System](#authentication-system)
8. [Navigation](#navigation)
9. [Project Structure](#project-structure)
10. [Developer Tools](#developer-tools)
11. [Optional Features](#optional-features)
12. [Production Ready Features](#production-ready-features)

---

## Core Technologies

### What You Get

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Expo SDK** | 54.x | Cross-platform development framework |
| **React** | 19.1.0 | UI library with latest features |
| **React Native** | 0.81.5 | Native mobile app framework |
| **TypeScript** | 5.9.2 | Type-safe JavaScript |
| **Expo Router** | 6.x | File-based routing |

### Why These Versions?

- **Expo 54** includes the New Architecture support
- **React 19** provides the latest React features and performance improvements
- **TypeScript** ensures type safety and better developer experience
- All versions are tested and stable together

---

## Storage System

### MMKV v4 - Fast Encrypted Storage

**What is MMKV?**
- 10x faster than AsyncStorage
- Encrypted by default
- Synchronous API (no async/await needed)
- Memory-mapped for efficiency

### Multiple Storage Instances

The template provides 5 pre-configured storage instances:

```typescript
import { storage, userStorage, cacheStorage, settingsStorage, secureStorage } from '@/lib/storage';

// 1. Main app storage
storage.set('key', 'value');
const value = storage.getString('key');

// 2. User-specific data (cleared on logout)
userStorage.set('preferences', userPreferences);

// 3. Cache storage (for API responses)
cacheStorage.set('api-cache-key', data);

// 4. Settings storage (app preferences)
settingsStorage.set('theme', 'dark');

// 5. Secure storage (encrypted - for sensitive data)
secureStorage.set('secret-key', sensitiveData);
```

### Storage Helpers

Type-safe helper functions for all data types:

```typescript
import { storageHelpers } from '@/lib/storage';

// Strings
storageHelpers.setString('name', 'John');
const name = storageHelpers.getString('name'); // string | undefined

// Numbers
storageHelpers.setNumber('age', 25);
const age = storageHelpers.getNumber('age'); // number | undefined

// Booleans
storageHelpers.setBoolean('isActive', true);
const isActive = storageHelpers.getBoolean('isActive'); // boolean | undefined

// Objects (JSON serialization)
storageHelpers.setObject('user', { id: 1, name: 'John' });
const user = storageHelpers.getObject<User>('user'); // User | undefined

// Delete
storageHelpers.delete('key');

// Clear all
storageHelpers.clearAll();

// Check existence
if (storageHelpers.contains('key')) { }

// Get all keys
const keys = storageHelpers.getAllKeys(); // string[]
```

### Storage Keys Constants

Centralized keys to prevent typos:

```typescript
import { STORAGE_KEYS } from '@/lib/storage';

// Use constants instead of strings
storage.set(STORAGE_KEYS.AUTH_TOKEN, token);
storage.set(STORAGE_KEYS.USER_ID, userId);
storage.set(STORAGE_KEYS.THEME_MODE, 'dark');
```

### Utility Functions

```typescript
import { clearUserData, clearCache } from '@/lib/storage';

// Clear all user data (useful for logout)
clearUserData(); // Clears userStorage, secureStorage, and auth keys

// Clear cache
clearCache(); // Clears cacheStorage only
```

---

## State Management

### Zustand Stores

**What is Zustand?**
- Minimal state management library
- No Provider wrapper needed
- Automatic re-renders only for components using the store
- Built-in persistence with MMKV

### Pre-Built Stores

#### 1. Auth Store (`src/stores/authStore.ts`)

Manages user authentication state with encrypted persistence:

```typescript
import { useAuthStore } from '@/stores';

function MyComponent() {
  const { user, isAuthenticated, login, logout, updateUser } = useAuthStore();

  // Login
  const handleLogin = async () => {
    const userData = { id: '1', email: 'user@example.com', name: 'John' };
    login(userData, 'auth-token-123');
    // Automatically persists to encrypted storage
  };

  // Logout
  const handleLogout = () => {
    logout(); // Clears all user data
  };

  // Update user
  const handleUpdate = () => {
    updateUser({ name: 'Jane' }); // Partial update
  };

  return (
    <View>
      {isAuthenticated ? (
        <Text>Welcome {user?.name}!</Text>
      ) : (
        <Button onPress={handleLogin}>Login</Button>
      )}
    </View>
  );
}
```

**Features:**
- Automatic persistence to encrypted MMKV storage
- Auto-logout clears all user data across storage instances
- Type-safe user object

#### 2. Theme Store (`src/stores/themeStore.ts`)

Manages app theme preferences:

```typescript
import { useThemeStore } from '@/stores';

function ThemeToggle() {
  const { mode, setMode, toggleTheme } = useThemeStore();

  return (
    <View>
      <Text>Current theme: {mode}</Text>
      <Button onPress={toggleTheme}>Toggle Theme</Button>
      <Button onPress={() => setMode('dark')}>Set Dark</Button>
      <Button onPress={() => setMode('light')}>Set Light</Button>
      <Button onPress={() => setMode('system')}>Use System</Button>
    </View>
  );
}
```

**Features:**
- Three modes: 'light', 'dark', 'system'
- Persists user preference
- Works with Unistyles theming system

#### 3. App Store (`src/stores/appStore.ts`)

General app settings and state:

```typescript
import { useAppStore } from '@/stores';

function Settings() {
  const {
    hasCompletedOnboarding,
    completeOnboarding,
    notificationsEnabled,
    setNotificationsEnabled,
    resetApp
  } = useAppStore();

  return (
    <View>
      {!hasCompletedOnboarding && (
        <Button onPress={completeOnboarding}>Complete Onboarding</Button>
      )}

      <Switch
        value={notificationsEnabled}
        onValueChange={setNotificationsEnabled}
      />

      <Button onPress={resetApp}>Reset All Settings</Button>
    </View>
  );
}
```

**Features:**
- Onboarding state tracking
- App version tracking
- Notification preferences
- Can be extended with your own app settings

### Creating Your Own Store

```typescript
// src/stores/myStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '@/lib/storage';

const mmkvStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.delete(name),
};

interface MyState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useMyStore = create<MyState>()(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
    }),
    {
      name: 'my-storage', // MMKV key
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
```

---

## Data Fetching

### TanStack Query v5

**What is TanStack Query?**
- Powerful data fetching and caching library
- Automatic background refetching
- Optimistic updates
- Request deduplication

### Pre-Configured QueryClient

Optimized settings for React Native:

```typescript
// Already configured in src/lib/queryClient.ts
- Retry failed requests (2 retries)
- 5-minute stale time
- 10-minute cache time
- Smart refetch on reconnect
```

### Query Keys Factory

Centralized query keys for better organization:

```typescript
import { queryKeys } from '@/lib/queryClient';

// Structured query keys
queryKeys.users.all         // ['users']
queryKeys.users.lists()     // ['users', 'list']
queryKeys.users.detail('1') // ['users', 'detail', '1']

// Easy invalidation
queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
```

### Example Query Hooks

#### Basic Query

```typescript
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';

function UserList() {
  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.users.lists(),
    queryFn: fetchUsers,
  });

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View>
      {users.map(user => (
        <Text key={user.id}>{user.name}</Text>
      ))}
      <Button onPress={() => refetch()}>Refresh</Button>
    </View>
  );
}
```

#### Mutation Hook

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

function CreateUser() {
  const queryClient = useQueryClient();

  const createUser = useMutation({
    mutationFn: (data) => api.createUser(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
  });

  const handleCreate = async () => {
    try {
      await createUser.mutateAsync({ name: 'John', email: 'john@example.com' });
      alert('User created!');
    } catch (error) {
      alert('Failed to create user');
    }
  };

  return (
    <Button onPress={handleCreate} disabled={createUser.isPending}>
      {createUser.isPending ? 'Creating...' : 'Create User'}
    </Button>
  );
}
```

#### Optimistic Updates

```typescript
const updateUser = useMutation({
  mutationFn: ({ id, data }) => api.updateUser(id, data),

  // Optimistic update: Update UI immediately
  onMutate: async ({ id, data }) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: queryKeys.users.detail(id) });

    // Snapshot previous value
    const previous = queryClient.getQueryData(queryKeys.users.detail(id));

    // Optimistically update
    queryClient.setQueryData(queryKeys.users.detail(id), (old) => ({
      ...old,
      ...data,
    }));

    return { previous };
  },

  // Rollback on error
  onError: (err, { id }, context) => {
    queryClient.setQueryData(queryKeys.users.detail(id), context.previous);
  },

  // Always refetch after error or success
  onSettled: (data, error, { id }) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
  },
});
```

---

## Styling & Theming

### React Native Unistyles v3

**What is Unistyles?**
- Powerful styling system with theme support
- No hooks needed (v3 breaking change!)
- Native performance
- Automatic dark mode

### ✅ Correct Usage (v3 Pattern)

```typescript
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

function MyComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello World</Text>
    </View>
  );
}

// Create styles OUTSIDE component - no hooks!
const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  text: {
    ...theme.typography.h1,
    color: theme.colors.text,
  },
}));
```

### ❌ Wrong Usage (v2 Pattern - Don't Use!)

```typescript
// THIS WILL NOT WORK - useStyles doesn't exist in v3
const { styles } = useStyles(stylesheet);
```

### Theme Structure

Access all theme values:

```typescript
const styles = StyleSheet.create((theme) => ({
  container: {
    // Colors
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.border,

    // Spacing (xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48)
    padding: theme.spacing.lg,
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,

    // Border Radius (sm: 8, md: 16, lg: 24, xl: 32, full: 9999)
    borderRadius: theme.borderRadius.md,

    // Typography
    ...theme.typography.h1,    // { fontSize: 32, fontWeight: '700', lineHeight: 40 }
    ...theme.typography.body,  // { fontSize: 16, fontWeight: '400', lineHeight: 24 }
  },
}));
```

### Available Colors

```typescript
theme.colors.primary          // Main brand color
theme.colors.secondary        // Accent color
theme.colors.background       // Screen background
theme.colors.surface          // Card/elevated surfaces
theme.colors.text             // Primary text
theme.colors.textSecondary    // Secondary text
theme.colors.textMuted        // Muted text
theme.colors.border           // Borders
theme.colors.error            // Error states
theme.colors.success          // Success states
theme.colors.warning          // Warning states
```

### Customizing Theme

#### Option 1: Edit theme directly

```typescript
// src/styles/theme.ts
export const lightTheme = {
  colors: {
    primary: '#YOUR_BRAND_COLOR',
    secondary: '#YOUR_ACCENT_COLOR',
    // ... rest of colors
  },
};
```

#### Option 2: Use theme generator

```typescript
import { generateLightTheme, generateDarkTheme } from '@/styles/themeGenerator';

const myLightTheme = generateLightTheme({
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  background: '#FFFFFF',
});

const myDarkTheme = generateDarkTheme({
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  background: '#000000',
});

// Then use in src/unistyles.ts
StyleSheet.configure({
  themes: {
    light: myLightTheme,
    dark: myDarkTheme,
  },
});
```

### Dark Mode

Automatic dark mode based on system settings:

```typescript
// Configured in src/unistyles.ts
StyleSheet.configure({
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  settings: {
    adaptiveThemes: true, // Auto-switch with system
  },
});
```

Manual theme control:

```typescript
import { useThemeStore } from '@/stores';

function ThemeToggle() {
  const { setMode } = useThemeStore();

  return (
    <>
      <Button onPress={() => setMode('light')}>Light</Button>
      <Button onPress={() => setMode('dark')}>Dark</Button>
      <Button onPress={() => setMode('system')}>System</Button>
    </>
  );
}
```

---

## UI Component Library

Pre-built, themeable components ready to use.

### Button Component

**Variants:** primary, secondary, outline, ghost, danger
**Sizes:** sm, md, lg

```typescript
import { Button } from '@/components/ui';

// Basic usage
<Button title="Click Me" onPress={handlePress} />

// With variants
<Button title="Primary" variant="primary" />
<Button title="Secondary" variant="secondary" />
<Button title="Outline" variant="outline" />
<Button title="Ghost" variant="ghost" />
<Button title="Delete" variant="danger" />

// Sizes
<Button title="Small" size="sm" />
<Button title="Medium" size="md" />
<Button title="Large" size="lg" />

// States
<Button title="Loading..." loading={true} />
<Button title="Disabled" disabled={true} />

// Full width
<Button title="Full Width" fullWidth />
```

### Card Component

**Variants:** elevated, outlined, filled

```typescript
import { Card } from '@/components/ui';

// Basic usage
<Card>
  <Text>Card content</Text>
</Card>

// Variants
<Card variant="elevated">
  <Text>Elevated card with shadow</Text>
</Card>

<Card variant="outlined">
  <Text>Card with border</Text>
</Card>

<Card variant="filled">
  <Text>Card with background</Text>
</Card>

// No padding
<Card noPadding>
  <Image source={image} />
</Card>
```

### Input Component

Form input with label, error, and helper text:

```typescript
import { Input } from '@/components/ui';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  return (
    <>
      <Input
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Input
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        secureTextEntry
        helperText="Must be at least 8 characters"
      />
    </>
  );
}
```

### Typography Component

Consistent text styling:

```typescript
import { Typography } from '@/components/ui';

// Variants
<Typography variant="h1">Main Title</Typography>
<Typography variant="h2">Section Title</Typography>
<Typography variant="h3">Subsection</Typography>
<Typography variant="body">Body text</Typography>
<Typography variant="bodySmall">Small text</Typography>
<Typography variant="caption">Caption text</Typography>

// Colors
<Typography color="primary">Primary color</Typography>
<Typography color="secondary">Secondary color</Typography>
<Typography color="error">Error text</Typography>
<Typography color="textMuted">Muted text</Typography>

// Modifiers
<Typography center>Centered text</Typography>
<Typography bold>Bold text</Typography>
<Typography variant="h2" color="primary" center bold>
  All modifiers
</Typography>
```

### Creating Custom Components

All components follow the same pattern:

```typescript
import { View, type ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface MyComponentProps extends Omit<ViewProps, 'style'> {
  variant?: 'default' | 'special';
  children: React.ReactNode;
}

export function MyComponent({ variant = 'default', children, ...props }: MyComponentProps) {
  return (
    <View style={[styles.base, styles[variant]]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  base: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
  },
  default: {
    backgroundColor: theme.colors.surface,
  },
  special: {
    backgroundColor: theme.colors.primary,
  },
}));
```

---

## Authentication System

### Pre-Built Auth Screens

**Included screens:**
1. **Sign In** (`/(auth)/sign-in`) - Email/password login
2. **Sign Up** (`/(auth)/sign-up`) - User registration
3. **Forgot Password** (`/(auth)/forgot-password`) - Password reset

### Features

✅ Form validation
✅ Error handling
✅ Loading states
✅ Responsive keyboard handling
✅ Link between screens
✅ Integration with auth store

### Automatic Auth Routing

The root layout handles authentication routing automatically:

```
Unauthenticated → /(auth)/sign-in
Authenticated → /(tabs)/
```

**How it works:**

1. App launches and checks auth state from MMKV
2. If `isAuthenticated === false` → Redirect to login
3. When user logs in → `isAuthenticated` becomes `true` → Redirect to app
4. When user logs out → `isAuthenticated` becomes `false` → Redirect to login

**No manual navigation needed!** Just update the auth store and routing happens automatically.

### Using Authentication

```typescript
import { useAuthStore } from '@/stores';

function LoginScreen() {
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // TODO: Replace with your actual API call
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const { user, token } = await response.json();

      // Update auth store - routing happens automatically!
      login(user, token);
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <View>
      <Input value={email} onChangeText={setEmail} />
      <Input value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
```

### Logout

```typescript
import { useAuthStore } from '@/stores';

function ProfileScreen() {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout(); // Clears all user data and redirects to login
  };

  return <Button title="Sign Out" onPress={handleLogout} />;
}
```

### Protected Routes

All routes outside `(auth)` are automatically protected. The root layout handles this:

```typescript
// User tries to access /(tabs)/profile
// → Root layout checks isAuthenticated
// → If false, redirects to /(auth)/sign-in
```

---

## Navigation

### Expo Router - File-Based Routing

Routes are created from file structure:

```
src/app/
  ├── (auth)/
  │   └── sign-in.tsx       →  /(auth)/sign-in
  ├── (tabs)/
  │   ├── index.tsx         →  /(tabs)/          (home)
  │   ├── profile.tsx       →  /(tabs)/profile
  │   └── settings.tsx      →  /(tabs)/settings
  ├── modal.tsx             →  /modal
  └── detail/[id].tsx       →  /detail/:id
```

### Navigation Between Screens

```typescript
import { Link, useRouter } from 'expo-router';

// Using Link component
<Link href="/(tabs)/profile">Go to Profile</Link>
<Link href="/detail/123">View Detail</Link>

// Programmatic navigation
function MyComponent() {
  const router = useRouter();

  const goToProfile = () => {
    router.push('/(tabs)/profile');
  };

  const goBack = () => {
    router.back();
  };

  const replaceScreen = () => {
    router.replace('/(auth)/sign-in'); // No back button
  };

  return (
    <>
      <Button onPress={goToProfile}>Profile</Button>
      <Button onPress={goBack}>Back</Button>
    </>
  );
}
```

### Dynamic Routes

```typescript
// File: src/app/user/[id].tsx
import { useLocalSearchParams } from 'expo-router';

export default function UserScreen() {
  const { id } = useLocalSearchParams();

  return <Text>User ID: {id}</Text>;
}

// Navigate to: /user/123
<Link href="/user/123">View User</Link>
router.push('/user/123');
```

### Passing Parameters

```typescript
// Navigate with params
router.push({
  pathname: '/detail/[id]',
  params: { id: '123', name: 'John' }
});

// Access params
const { id, name } = useLocalSearchParams();
```

### Tab Navigation

Pre-configured in `/(tabs)/_layout.tsx`:

- **Home** - Welcome screen with features overview
- **Examples** - Interactive demos of all libraries
- **Profile** - User profile and settings

Add more tabs:

```typescript
// src/app/(tabs)/settings.tsx
export default function SettingsScreen() {
  return <Text>Settings</Text>;
}

// Update src/app/(tabs)/_layout.tsx
<Tabs.Screen
  name="settings"
  options={{
    title: 'Settings',
    tabBarIcon: ({ color }) => <Icon name="settings" color={color} />,
  }}
/>
```

---

## Project Structure

```
src/
├── app/                          # Expo Router pages
│   ├── (auth)/                   # Authentication screens
│   │   ├── _layout.tsx          # Auth stack layout
│   │   ├── sign-in.tsx          # Login screen
│   │   ├── sign-up.tsx          # Registration screen
│   │   └── forgot-password.tsx  # Password reset
│   ├── (tabs)/                   # Main app tabs
│   │   ├── _layout.tsx          # Tab navigation
│   │   ├── index.tsx            # Home screen
│   │   ├── examples.tsx         # Library demos
│   │   └── profile.tsx          # Profile & settings
│   ├── _layout.tsx              # Root layout with auth routing
│   └── modal.tsx                # Example modal
│
├── components/
│   ├── ui/                       # UI component library
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Typography.tsx
│   │   └── index.ts
│   └── [legacy components]       # Can be removed
│
├── lib/                          # Core utilities
│   ├── storage.ts               # MMKV configuration
│   ├── queryClient.ts           # TanStack Query setup
│   └── supabase.ts              # Supabase client (optional)
│
├── stores/                       # Zustand state management
│   ├── authStore.ts             # Authentication state
│   ├── themeStore.ts            # Theme preferences
│   ├── appStore.ts              # App settings
│   └── index.ts                 # Store exports
│
├── hooks/                        # Custom React hooks
│   └── queries/                 # React Query hooks
│       ├── useExampleQuery.ts   # Example patterns
│       └── useSupabaseAuth.ts   # Supabase auth hooks
│
├── styles/                       # Theming system
│   ├── theme.ts                 # Theme configuration
│   └── themeGenerator.ts        # Custom theme utility
│
├── assets/                       # Images, fonts, etc.
│   ├── fonts/
│   └── images/
│
├── unistyles.ts                  # Unistyles initialization
└── constants/                    # App constants
```

### Where to Put Your Code

| Type | Location | Example |
|------|----------|---------|
| New screen | `src/app/*.tsx` | `src/app/settings.tsx` |
| New tab | `src/app/(tabs)/*.tsx` | `src/app/(tabs)/messages.tsx` |
| Reusable component | `src/components/` | `src/components/MessageCard.tsx` |
| UI component | `src/components/ui/` | `src/components/ui/Badge.tsx` |
| State store | `src/stores/` | `src/stores/cartStore.ts` |
| API query | `src/hooks/queries/` | `src/hooks/queries/useProducts.ts` |
| Utility function | `src/utils/` | `src/utils/formatDate.ts` |
| Type definitions | `src/types/` | `src/types/api.ts` |

---

## Developer Tools

### Path Aliases

Access files easily with `@/` prefix:

```typescript
// Instead of: import { Button } from '../../../components/ui/Button'
import { Button } from '@/components/ui';

// Works for everything in src/
import { useAuthStore } from '@/stores';
import { storage } from '@/lib/storage';
import { queryKeys } from '@/lib/queryClient';
```

### Environment Variables

Use `.env` file for configuration:

```env
# .env
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_MMKV_ENCRYPTION_KEY=your-secure-key
```

Access in code:

```typescript
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const encryptionKey = process.env.EXPO_PUBLIC_MMKV_ENCRYPTION_KEY;
```

**Note:** Variables must start with `EXPO_PUBLIC_` to be accessible in the app.

### NPM Scripts

```bash
npm start              # Start Expo dev server
npm run ios            # Run on iOS simulator
npm run android        # Run on Android emulator
npm run web            # Run in browser
npm run setup          # Run configuration wizard
```

### TypeScript

Full TypeScript support with strict mode:

- Type checking on save
- IntelliSense autocomplete
- Compile-time error detection
- Better refactoring

---

## Optional Features

### Supabase Integration

Supabase code is included but commented out. To enable:

**1. Install Supabase:**
```bash
npm install @supabase/supabase-js
```

**2. Add credentials to `.env`:**
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**3. Uncomment code in `src/lib/supabase.ts`:**
```typescript
// Change this:
export const supabaseEnabled = false;

// To this:
export const supabaseEnabled = true;

// And uncomment all the import/export lines
```

**4. Uncomment auth hooks in `src/hooks/queries/useSupabaseAuth.ts`**

**5. Use in your app:**
```typescript
import { supabase } from '@/lib/supabase';
import { useSignIn, useSignUp, useSignOut } from '@/hooks/queries/useSupabaseAuth';

function LoginScreen() {
  const signIn = useSignIn();

  const handleLogin = async () => {
    await signIn.mutateAsync({ email, password });
    // Routing happens automatically via auth store
  };
}
```

---

## Production Ready Features

### Performance Optimizations

✅ **MMKV Storage** - 10x faster than AsyncStorage
✅ **TanStack Query** - Automatic request deduplication and caching
✅ **Unistyles** - Native styling performance
✅ **Zustand** - Minimal re-renders
✅ **New Architecture** - Expo 54 with new architecture support

### Security Features

✅ **Encrypted Storage** - MMKV with encryption key
✅ **Secure Token Storage** - Separate secure storage instance
✅ **Type Safety** - Full TypeScript coverage
✅ **Input Validation** - Form validation on auth screens

### User Experience

✅ **Automatic Auth Routing** - Seamless login/logout flow
✅ **Loading States** - Proper loading indicators
✅ **Error Handling** - User-friendly error messages
✅ **Dark Mode** - Automatic system theme support
✅ **Keyboard Handling** - Proper keyboard avoidance
✅ **Splash Screen** - Proper initialization handling

### Developer Experience

✅ **TypeScript** - Full type safety
✅ **Path Aliases** - Easy imports with `@/`
✅ **ESLint Ready** - Code quality tools
✅ **Documentation** - Comprehensive guides
✅ **Examples** - Working code samples
✅ **Hot Reload** - Fast development iteration

---

## Next Steps

### After Creating Your App

1. **Run the setup wizard** - Configure app name, theme, features
2. **Replace mock auth** - Implement your actual API calls
3. **Add your API endpoints** - Create query hooks for your backend
4. **Customize theme** - Update colors to match your brand
5. **Build features** - Use the patterns established in examples

### Example: Building a Feature

Let's build a simple notes feature:

**1. Create a store:**
```typescript
// src/stores/notesStore.ts
export const useNotesStore = create(persist(
  (set) => ({
    notes: [],
    addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
  }),
  { name: 'notes-storage', storage: createJSONStorage(() => storage) }
));
```

**2. Create a screen:**
```typescript
// src/app/(tabs)/notes.tsx
export default function NotesScreen() {
  const { notes, addNote } = useNotesStore();

  return (
    <ScrollView>
      {notes.map(note => (
        <Card key={note.id}>
          <Typography>{note.text}</Typography>
        </Card>
      ))}
    </ScrollView>
  );
}
```

**3. Add to tab navigation:**
```typescript
// src/app/(tabs)/_layout.tsx
<Tabs.Screen name="notes" options={{ title: 'Notes' }} />
```

Done! Your notes are automatically persisted with MMKV.

---

## Support & Resources

- **README.md** - Quick start guide
- **ARCHITECTURE.md** - Design decisions and patterns
- **UNISTYLES_MMKV_REFERENCE.md** - v3/v4 migration guide
- **TEMPLATE_USAGE.md** - Publishing and customization
- **HOW_TO_USE.md** - Quick reference
- **GitHub Issues** - Report bugs or request features

---

## What This Template DOESN'T Include

To keep the template clean and flexible:

❌ No form library (add react-hook-form if needed)
❌ No animation library beyond basic Reanimated
❌ No specific UI kit (you have base components)
❌ No analytics (add your preferred service)
❌ No error tracking (add Sentry if needed)
❌ No push notifications (add expo-notifications)
❌ No specific API client (implement your own)
❌ No database ORM (use Supabase or your choice)

This keeps the template lean and lets you add exactly what you need.

---

## Summary

This template gives you:

✅ **Modern tech stack** - Latest versions of all libraries
✅ **Complete auth system** - Login, signup, automatic routing
✅ **Powerful storage** - Fast, encrypted MMKV
✅ **Smart state management** - Zustand with persistence
✅ **Efficient data fetching** - TanStack Query with caching
✅ **Beautiful theming** - Unistyles with dark mode
✅ **Production-ready** - Security, performance, UX
✅ **Developer-friendly** - TypeScript, examples, docs

**Start building your app in minutes, not days!** 🚀
