# React Native/Expo Template

A production-ready React Native template built with Expo, featuring modern libraries and best practices for rapid app development.

## Using This Template

Create a new app from this template in seconds:

```bash
# From NPM (once published)
npx create-expo-app MyApp --template premier99-react-native-template

# From GitHub
npx create-expo-app MyApp --template https://github.com/gigs-slc/premier99software-expo-template

# Then navigate and start
cd MyApp
npm run setup  # Configure your app (runs automatically via postinstall)
npx expo prebuild
npx expo run:ios
```

See [TEMPLATE_USAGE.md](./TEMPLATE_USAGE.md) for detailed publishing and usage instructions.

## Features

This template comes pre-configured with:

- **📱 Expo SDK 54** - Latest Expo with New Architecture support
- **🧭 Expo Router** - File-based routing with native navigation
- **🗄️ MMKV v4** - Fast, encrypted key-value storage
- **🎨 React Native Unistyles v3** - Powerful theming system with dark mode
- **🐻 Zustand** - Simple state management with MMKV persistence
- **🔍 TanStack Query v5** - Data fetching, caching, and synchronization
- **🔐 Authentication Flow** - Pre-built login/signup screens
- **🎯 TypeScript** - Full type safety
- **🧩 UI Component Library** - Reusable components (Button, Card, Input, etc.)
- **🎭 Dark Mode** - Built-in theme switching
- **⚡ Optional Supabase** - Backend integration ready

## Quick Start

### 1. Install dependencies

```bash
npm install
# or
yarn install
```

### 2. Run the setup script (Optional)

Customize your app name, theme colors, and features:

```bash
npm run setup
```

This will prompt you to:
- Set app name and package identifier
- Choose theme colors
- Enable/disable optional features (Supabase, auth screens)

### 3. Start development

```bash
# Start Expo dev server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Project Structure

```
src/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Authentication screens
│   │   ├── sign-in.tsx
│   │   ├── sign-up.tsx
│   │   └── forgot-password.tsx
│   ├── (tabs)/            # Main app tabs
│   │   ├── index.tsx      # Home screen
│   │   ├── examples.tsx   # Library examples
│   │   └── profile.tsx    # Profile & settings
│   └── _layout.tsx        # Root layout
├── components/
│   └── ui/                # Reusable UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       └── Typography.tsx
├── lib/                   # Core utilities
│   ├── storage.ts         # MMKV configuration
│   ├── queryClient.ts     # TanStack Query setup
│   └── supabase.ts        # Supabase client (optional)
├── stores/                # Zustand stores
│   ├── authStore.ts       # Authentication state
│   ├── themeStore.ts      # Theme preferences
│   └── appStore.ts        # App settings
├── hooks/
│   └── queries/           # React Query hooks
├── styles/
│   ├── theme.ts           # Theme configuration
│   └── themeGenerator.ts  # Custom theme utility
└── utils/                 # Helper functions
```

## Key Libraries Usage

### MMKV Storage

Fast, encrypted storage for persisting data:

```typescript
import { storageHelpers } from '@/lib/storage';

// Simple key-value storage
storageHelpers.setString('key', 'value');
const value = storageHelpers.getString('key');

// Store objects
storageHelpers.setObject('user', { name: 'John', age: 30 });
const user = storageHelpers.getObject<User>('user');
```

### Zustand State Management

Global state with automatic MMKV persistence:

```typescript
import { useAuthStore } from '@/stores';

function MyComponent() {
  const { user, login, logout } = useAuthStore();

  // State automatically persists to MMKV
  return <Text>{user?.name}</Text>;
}
```

### TanStack Query

Data fetching with caching and mutations:

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

function MyComponent() {
  // Fetch data with automatic caching
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  // Mutations with optimistic updates
  const createUser = useMutation({
    mutationFn: createUserAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
}
```

### Unistyles Theming

Consistent styling with theme support (v3 - no hooks!):

```typescript
import { StyleSheet } from 'react-native-unistyles';

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
}));

// Use directly - no hooks needed!
<View style={styles.container} />
```

## Customization

### Changing Theme Colors

Edit `src/styles/theme.ts`:

```typescript
export const lightTheme = {
  colors: {
    primary: '#YOUR_COLOR',
    secondary: '#YOUR_ACCENT',
    // ... rest of theme
  },
};
```

Or use the theme generator:

```typescript
import { generateLightTheme } from '@/styles/themeGenerator';

const myTheme = generateLightTheme({
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
});
```

### Adding Supabase

1. Uncomment code in `src/lib/supabase.ts`
2. Install Supabase:
   ```bash
   npm install @supabase/supabase-js
   ```
3. Add credentials to `.env`:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-key
   ```

### Removing Features

**Remove Authentication:**
```bash
rm -rf src/app/(auth)
```

**Remove Example Screens:**
Edit `src/app/(tabs)/_layout.tsx` and remove the examples tab.

## Important Notes

### MMKV v4 Breaking Changes

This template uses MMKV v4, which has breaking changes from v3:

```typescript
// ❌ WRONG (v3)
const storage = new MMKV();

// ✅ CORRECT (v4)
const storage = createMMKV({ id: 'storage-id' });
```

### Unistyles v3 Breaking Changes

Unistyles v3 removed all hooks-based APIs:

```typescript
// ❌ WRONG (v2)
const { styles } = useStyles(stylesheet);

// ✅ CORRECT (v3)
const styles = StyleSheet.create((theme) => ({...}));
<View style={styles.container} />
```

See `UNISTYLES_MMKV_REFERENCE.md` for complete patterns.

## Scripts

```bash
npm start          # Start Expo dev server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run in web browser
npm run setup      # Run configuration wizard
```

## Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_MMKV_ENCRYPTION_KEY=your-encryption-key
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
```

## TypeScript

This template uses strict TypeScript. Path aliases are configured:

```typescript
import { Button } from '@/components/ui';
import { storage } from '@/lib/storage';
```

## Contributing

This template is designed to be forked and customized for your projects. Feel free to modify anything to fit your needs!

## License

MIT

## Support

For issues and questions:
- Check the reference documentation in `UNISTYLES_MMKV_REFERENCE.md`
- Review example code in `src/app/(tabs)/examples.tsx`
- Open an issue on GitHub

---

**Happy coding!** 🚀
