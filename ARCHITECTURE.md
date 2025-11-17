# Architecture Documentation

This document explains the architectural decisions and patterns used in this React Native/Expo template.

## Table of Contents

1. [Directory Structure](#directory-structure)
2. [State Management](#state-management)
3. [Data Fetching](#data-fetching)
4. [Storage Strategy](#storage-strategy)
5. [Styling System](#styling-system)
6. [Navigation](#navigation)
7. [Authentication Flow](#authentication-flow)
8. [Performance Considerations](#performance-considerations)

## Directory Structure

### Why src-based structure?

All source code lives under `src/` for better organization and clear separation from configuration files.

```
src/
├── app/           # Expo Router pages (routing structure)
├── components/    # Reusable React components
├── lib/           # Core utilities and configurations
├── stores/        # Zustand state management
├── hooks/         # Custom React hooks
├── styles/        # Theme and styling
└── utils/         # Helper functions
```

**Benefits:**
- Clear separation of concerns
- Easy to locate files
- Better IDE autocomplete with path aliases (`@/`)
- Scalable for large projects

## State Management

### Three-Layer State Architecture

This template uses different tools for different types of state:

#### 1. **Local State** - React's useState/useReducer
Use for: Component-specific state that doesn't need persistence

```typescript
const [count, setCount] = useState(0);
```

#### 2. **Global State** - Zustand
Use for: App-wide state that needs to be shared across components

```typescript
// stores/authStore.ts
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

**Why Zustand?**
- Minimal boilerplate
- No Provider wrapper needed
- Easy to test
- Excellent TypeScript support
- Small bundle size (1.2KB)

#### 3. **Server State** - TanStack Query
Use for: Data from APIs that needs caching, synchronization, and background updates

```typescript
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
});
```

**Why TanStack Query?**
- Automatic caching and deduplication
- Background refetching
- Optimistic updates
- Pagination and infinite scroll support
- Request cancellation

### Zustand + MMKV Persistence

State is automatically persisted to MMKV storage:

```typescript
create(
  persist(
    (set) => ({...}),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
```

**Benefits:**
- State survives app restarts
- Faster than AsyncStorage
- Encrypted storage for sensitive data
- No performance impact on renders

## Data Fetching

### Query Keys Pattern

Centralized query keys prevent typos and make invalidation easier:

```typescript
// lib/queryClient.ts
export const queryKeys = {
  users: {
    all: ['users'],
    lists: () => [...queryKeys.users.all, 'list'],
    detail: (id: string) => [...queryKeys.users.all, id],
  },
};

// Usage
useQuery({ queryKey: queryKeys.users.detail('123') });
```

### Mutation Patterns

#### Basic Mutation
```typescript
const mutation = useMutation({
  mutationFn: createUser,
  onSuccess: () => {
    queryClient.invalidateQueries(['users']);
  },
});
```

#### Optimistic Updates
For instant UI feedback:

```typescript
const mutation = useMutation({
  mutationFn: updateUser,
  onMutate: async (newData) => {
    // Cancel outgoing queries
    await queryClient.cancelQueries(['user', id]);

    // Snapshot previous value
    const previous = queryClient.getQueryData(['user', id]);

    // Optimistically update
    queryClient.setQueryData(['user', id], newData);

    return { previous };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(['user', id], context.previous);
  },
});
```

## Storage Strategy

### Multiple MMKV Instances

Different storage instances for different data types:

```typescript
export const storage = createMMKV({ id: 'app-storage' });
export const userStorage = createMMKV({ id: 'user-storage' });
export const cacheStorage = createMMKV({ id: 'cache-storage' });
export const secureStorage = createMMKV({
  id: 'secure-storage',
  encryptionKey: process.env.EXPO_PUBLIC_MMKV_ENCRYPTION_KEY,
});
```

**Benefits:**
- Clear data organization
- Easy to clear specific data types
- Different encryption keys for sensitive data
- Better memory management

### Storage Keys Constants

Centralized keys prevent typos:

```typescript
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth.token',
  USER_ID: 'auth.userId',
  THEME_MODE: 'preferences.themeMode',
} as const;
```

### When to Use Each Storage?

| Storage Type | Use Case | Example |
|-------------|----------|---------|
| `storage` | General app data | App settings, preferences |
| `userStorage` | User-specific data | User profile, user preferences |
| `cacheStorage` | Temporary data | API response cache |
| `secureStorage` | Sensitive data | Auth tokens, passwords |

## Styling System

### Unistyles v3 Architecture

**No Hooks Pattern:**
```typescript
// Create styles outside component
const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
  },
}));

// Use directly in JSX
<View style={styles.container} />
```

**Why this pattern?**
- Better performance (styles created once)
- No re-renders on theme change (Unistyles handles it internally)
- Simpler code structure
- Easier to test

### Theme Structure

```typescript
{
  colors: {...},      // Color palette
  spacing: {...},     // Spacing scale (xs, sm, md, lg, xl)
  borderRadius: {...},// Border radius scale
  typography: {...},  // Text styles
}
```

### Dark Mode Strategy

Unistyles automatically switches themes based on system settings:

```typescript
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

Manual override via Zustand:

```typescript
const { mode, setMode } = useThemeStore();
setMode('dark'); // 'light' | 'dark' | 'system'
```

## Navigation

### File-Based Routing (Expo Router)

Routes are automatically generated from file structure:

```
app/
├── (auth)/
│   └── sign-in.tsx      →  /(auth)/sign-in
├── (tabs)/
│   ├── index.tsx        →  /(tabs)/
│   └── profile.tsx      →  /(tabs)/profile
└── _layout.tsx          →  Root layout
```

### Route Groups

Parentheses `()` create route groups without adding to URL:

- `(auth)` - Authentication screens
- `(tabs)` - Main app tab navigation

### Layout Hierarchy

```
_layout.tsx (Root)
  ├── QueryClientProvider
  └── ThemeProvider
      └── Stack Navigation
          ├── (tabs)/_layout.tsx (Tab Navigator)
          └── (auth)/_layout.tsx (Auth Stack)
```

## Authentication Flow

### Auth State Management

```
┌─────────────┐
│ useAuthStore│
│  (Zustand)  │──────┐
└─────────────┘      │
                     │ Persisted to
                     ▼
              ┌─────────────┐
              │   MMKV      │
              │ (Encrypted) │
              └─────────────┘
```

### Auth Flow

1. User signs in via `/(auth)/sign-in`
2. Auth state updated in Zustand
3. State persisted to encrypted MMKV
4. Navigation to main app `/(tabs)`
5. On app restart, state restored from MMKV

### Optional Supabase Integration

```typescript
// lib/supabase.ts
export const supabase = createClient(url, key, {
  auth: {
    storage: MMKVStorage, // Use MMKV instead of AsyncStorage
    persistSession: true,
  },
});

// Sync with Zustand
const { login } = useAuthStore();
const signIn = useSignIn();

const result = await signIn.mutateAsync({ email, password });
login(result.user, result.session.access_token);
```

## Performance Considerations

### 1. MMKV for Storage
- **10x faster** than AsyncStorage
- Synchronous API (no async/await needed)
- Encrypted by default
- Memory-mapped for efficiency

### 2. TanStack Query Caching
- Automatic request deduplication
- Background refetching
- Stale-while-revalidate pattern
- Configurable cache times

### 3. Unistyles Performance
- Styles created once, not on every render
- No runtime style calculations
- Native performance (uses JSI)
- Automatic theme switching without re-renders

### 4. Zustand Optimization
- Minimal re-renders (only subscribing components update)
- No Context Provider wrapper (better tree structure)
- Small bundle size
- Built-in devtools support

### 5. React Optimizations
```typescript
// Memoize expensive calculations
const value = useMemo(() => expensiveCalc(data), [data]);

// Memoize callbacks
const handlePress = useCallback(() => {
  doSomething();
}, [dependency]);

// Memoize components
const MemoizedComponent = memo(Component);
```

## Best Practices

### 1. Type Safety
- Use TypeScript strict mode
- Define interfaces for all data structures
- Type Zustand stores properly
- Type query hooks with generics

### 2. Error Handling
- Use TanStack Query's error states
- Show user-friendly error messages
- Log errors for debugging
- Implement error boundaries

### 3. Code Organization
- One component per file
- Group related files together
- Use barrel exports (`index.ts`)
- Keep components small and focused

### 4. Testing
- Unit test utility functions
- Integration test critical flows
- Mock MMKV in tests
- Use React Testing Library

## Scaling Guidelines

### When to Add New Libraries

**State Management:**
- Complex forms → React Hook Form
- Complex state machines → XState

**UI:**
- Animations → React Native Reanimated
- Gestures → React Native Gesture Handler
- Charts → Victory Native

**Backend:**
- Real-time → Supabase Realtime
- File uploads → Supabase Storage
- Push notifications → Expo Notifications

### Folder Organization (Large Apps)

```
src/
├── features/          # Feature-based modules
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── stores/
│   │   └── screens/
│   └── profile/
├── shared/            # Shared across features
│   ├── components/
│   ├── hooks/
│   └── utils/
└── core/             # Core functionality
    ├── api/
    ├── storage/
    └── navigation/
```

---

This architecture is designed to scale from small projects to large production apps while maintaining code quality and developer experience.
