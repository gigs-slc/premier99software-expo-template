# Building a Production-Ready React Native/Expo Template: A Modern Approach

## Stop wasting hours setting up every new React Native project. Here's how I built a reusable template that saves me days of work.

---

Every React Native developer knows the pain: starting a new project means hours of configuration. Install dependencies, set up navigation, configure storage, implement authentication, build a component library—rinse and repeat for every client project.

After building dozens of React Native apps, I decided enough was enough. I created a production-ready template that includes everything I need to start building features on day one. In this article, I'll show you exactly how I built it and how you can use it (or create your own).

---

## What We're Building

A React Native/Expo template that includes:

- ⚡ **MMKV v4** - Fast, encrypted storage (10x faster than AsyncStorage)
- 🎨 **Unistyles v3** - Powerful theming with automatic dark mode
- 🐻 **Zustand** - Simple state management with persistence
- 🔍 **TanStack Query v5** - Smart data fetching and caching
- 🔐 **Complete Auth System** - Login, signup, automatic routing
- 🧩 **UI Component Library** - Reusable themed components
- 📱 **Expo Router** - File-based navigation
- 🎯 **Full TypeScript** - Type safety throughout

**The best part?** Creating a new app with all of this takes just one command:

```bash
npx create-expo-app MyApp --template https://github.com/gigs-slc/premier99software-expo-template
```

---

## Why This Template Matters

### The Problem with Starting from Scratch

Every time I started a new React Native project, I'd spend 2-3 days on the same setup tasks:

1. Install and configure storage
2. Set up state management
3. Build authentication flow
4. Create reusable components
5. Configure theming
6. Set up data fetching

**That's 2-3 days before writing a single line of business logic.**

### The Template Approach

With this template, all of that is done. I can jump straight into building features because the infrastructure is already in place and battle-tested across multiple production apps.

---

## Part 1: The Foundation - Core Libraries

### Choosing the Right Stack

After building apps with various tech stacks, I settled on these technologies:

#### MMKV v4 for Storage

**Why not AsyncStorage?** MMKV is 10x faster and includes encryption by default.

**Critical detail:** MMKV v4 uses a completely different API than v3:

```typescript
// ❌ WRONG (v3 API)
const storage = new MMKV();

// ✅ CORRECT (v4 API)
import { createMMKV } from 'react-native-mmkv';
const storage = createMMKV({ id: 'app-storage' });
```

I created multiple storage instances for different purposes:

```typescript
// src/lib/storage.ts
export const storage = createMMKV({ id: 'app-storage' });
export const userStorage = createMMKV({ id: 'user-storage' });
export const secureStorage = createMMKV({
  id: 'secure-storage',
  encryptionKey: process.env.EXPO_PUBLIC_MMKV_ENCRYPTION_KEY,
});
```

**Why multiple instances?** When a user logs out, I can clear `userStorage` and `secureStorage` without touching app preferences.

#### Unistyles v3 for Theming

**Critical breaking change:** Unistyles v3 completely removed the hooks API.

```typescript
// ❌ WRONG (v2 API - doesn't exist in v3!)
const { styles } = useStyles(stylesheet);

// ✅ CORRECT (v3 API)
import { StyleSheet } from 'react-native-unistyles';

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
}));

// Use directly - no hooks!
<View style={styles.container} />
```

This pattern is actually better—styles are created once, not on every render.

#### Zustand for State Management

Zustand is perfect for React Native: minimal API, no Provider wrapper, and automatic persistence.

Here's how I integrated it with MMKV:

```typescript
// src/stores/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { secureStorage } from '@/lib/storage';

const mmkvStorage = {
  getItem: (name: string) => secureStorage.getString(name) ?? null,
  setItem: (name: string, value: string) => secureStorage.set(name, value),
  removeItem: (name: string) => secureStorage.delete(name),
};

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
```

**The magic:** Auth state automatically persists to encrypted MMKV. When the app restarts, the user is still logged in.

#### TanStack Query for Data Fetching

TanStack Query (formerly React Query) handles all the complexity of data fetching:

```typescript
// src/lib/queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});
```

I use a query keys factory pattern for better organization:

```typescript
export const queryKeys = {
  users: {
    all: ['users'],
    lists: () => [...queryKeys.users.all, 'list'],
    detail: (id: string) => [...queryKeys.users.all, id],
  },
};

// Easy invalidation
queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
```

---

## Part 2: The Authentication System

This is where things get interesting. I wanted authentication to work like a production app—automatic routing based on auth state.

### The Routing Strategy

**Inspiration:** I studied how TrailTalk (a production app I built) handles auth routing. The key insight is that routing should be **declarative and reactive**.

Here's the pattern:

```typescript
// src/app/_layout.tsx
function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    // Automatic routing based on auth state
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/sign-in'); // Not logged in → Login screen
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)'); // Logged in → Main app
    }
  }, [isAuthenticated, segments]);

  return <Stack>...</Stack>;
}
```

**How it works:**

1. App launches and checks `isAuthenticated` from Zustand (which loaded from MMKV)
2. User not logged in? → Redirect to sign-in
3. User logs in? → Zustand updates → Effect triggers → Redirect to app
4. User logs out? → Zustand clears → Effect triggers → Redirect to sign-in

**No manual navigation calls needed!** Just update the auth store and routing happens automatically.

### Pre-Built Auth Screens

I built three auth screens with full validation:

- **Sign In** - Email/password with error handling
- **Sign Up** - Registration with password confirmation
- **Forgot Password** - Reset flow with success state

All screens integrate seamlessly with the auth store:

```typescript
// src/app/(auth)/sign-in.tsx
export default function SignInScreen() {
  const { login } = useAuthStore();

  const handleLogin = async () => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const { user, token } = await response.json();

    login(user, token); // That's it! Routing happens automatically
  };
}
```

---

## Part 3: The UI Component Library

Every project needs the same basic components: buttons, inputs, cards. Instead of rebuilding them each time, I created a library with Unistyles v3.

### Button Component

```typescript
// src/components/ui/Button.tsx
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

export function Button({ title, variant = 'primary', loading, ...props }) {
  return (
    <Pressable
      style={[styles.base, styles[variant], loading && styles.loading]}
      {...props}
    >
      {loading ? <ActivityIndicator /> : <Text style={styles.text}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  base: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  // ... other variants
}));
```

**Usage:**

```typescript
<Button title="Save" variant="primary" onPress={handleSave} />
<Button title="Cancel" variant="outline" onPress={handleCancel} />
<Button title="Delete" variant="danger" onPress={handleDelete} />
```

I followed the same pattern for Card, Input, and Typography components. They're all themeable and consistent.

---

## Part 4: The Setup Script

Here's where the template becomes truly reusable. I created an interactive setup script that runs after installation:

```javascript
// scripts/setup.js
async function run() {
  // Prompt for app details
  const appName = await question('App name: ');
  const packageName = await question('Package name (com.company.app): ');
  const primaryColor = await question('Primary color (hex): ');

  // Update app.json
  const appJson = JSON.parse(fs.readFileSync('app.json'));
  appJson.expo.name = appName;
  appJson.expo.ios.bundleIdentifier = packageName;
  fs.writeFileSync('app.json', JSON.stringify(appJson, null, 2));

  // Update theme colors
  const themeContent = fs.readFileSync('src/styles/theme.ts', 'utf8');
  const updatedTheme = themeContent.replace(
    /primary: '#[0-9A-Fa-f]{6}'/,
    `primary: '${primaryColor}'`
  );
  fs.writeFileSync('src/styles/theme.ts', updatedTheme);

  // Generate .env file
  const encryptionKey = generateRandomKey();
  fs.writeFileSync('.env', `EXPO_PUBLIC_MMKV_ENCRYPTION_KEY=${encryptionKey}\n`);

  console.log('✅ Setup complete!');
}
```

**Triggered automatically** via `postinstall` script in package.json:

```json
{
  "scripts": {
    "postinstall": "node scripts/setup.js || true"
  }
}
```

---

## Part 5: Making it a Template

### Publishing to GitHub

The template needs to be public on GitHub to work with `create-expo-app`:

```bash
# Initialize and push
git init
git add .
git commit -m "Initial template setup"
git remote add origin git@github.com:username/your-template.git
git push -u origin main
```

**Important:** Go to GitHub Settings → Check "Template repository"

### Template Configuration

Create `template.json` at the root:

```json
{
  "name": "your-template-name",
  "description": "Production-ready React Native/Expo template",
  "version": "1.0.0"
}
```

Update `package.json`:

```json
{
  "name": "your-template-name",
  "description": "Production-ready template with MMKV, Zustand, TanStack Query",
  "repository": {
    "type": "git",
    "url": "https://github.com/username/your-template"
  }
}
```

**Remove** `"private": true` from package.json!

---

## Using the Template

Once published, creating a new app is simple:

```bash
# From GitHub
npx create-expo-app MyApp --template https://github.com/username/your-template

# Navigate and configure
cd MyApp
npm run setup  # Interactive configuration (runs automatically)

# Build and run
npx expo prebuild
npx expo run:ios
```

The setup wizard will ask for:
- App name and package identifier
- Theme colors
- Whether to include optional features (like Supabase)

Then you're ready to build!

---

## Project Structure

The template follows a clean, scalable structure:

```
src/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Auth screens
│   ├── (tabs)/            # Main app tabs
│   └── _layout.tsx        # Root with auth routing
├── components/
│   └── ui/                # Component library
├── lib/                   # Core utilities
│   ├── storage.ts         # MMKV setup
│   ├── queryClient.ts     # TanStack Query config
│   └── supabase.ts        # Optional backend
├── stores/                # Zustand stores
├── hooks/
│   └── queries/           # React Query hooks
└── styles/                # Theme configuration
```

---

## Real-World Benefits

Since creating this template, I've used it for 5+ client projects. Here's what I've learned:

### Time Savings

**Before template:**
- Day 1: Project setup and dependencies
- Day 2: Authentication and storage
- Day 3: Component library and theming
- Day 4: Start building features

**With template:**
- Day 1: Building features ✅

That's **3 days saved** on every project.

### Consistency

All my projects use the same patterns:
- Same storage helpers
- Same component APIs
- Same auth flow
- Same state management

This means:
- Easy to switch between projects
- Team members can onboard faster
- Bugs fixed once apply to all projects

### Production-Ready from Day One

The template includes:
- Encrypted storage
- Proper error handling
- Loading states
- Dark mode support
- TypeScript throughout
- Proper auth routing

I don't have to "circle back" to add these—they're already there.

---

## Common Pitfalls and How I Solved Them

### 1. MMKV/Unistyles Version Confusion

**Problem:** Many tutorials show v2/v3 APIs that don't work with v4.

**Solution:** I created `UNISTYLES_MMKV_REFERENCE.md` with correct patterns:

```typescript
// MMKV v4 (correct)
import { createMMKV } from 'react-native-mmkv';
const storage = createMMKV({ id: 'storage' });

// Unistyles v3 (correct)
const styles = StyleSheet.create((theme) => ({...}));
<View style={styles.container} />
```

### 2. Auth State Not Persisting

**Problem:** Auth state lost on app restart.

**Solution:** Zustand's persist middleware with MMKV storage adapter. The key is giving Zustand time to hydrate before routing:

```typescript
// Wait for hydration
await new Promise(resolve => setTimeout(resolve, 100));
setIsReady(true); // Now routing can happen
```

### 3. Slow Initial Load

**Problem:** All storage operations in one place slowed startup.

**Solution:** Multiple MMKV instances with lazy loading:

```typescript
// Only load what's needed immediately
export const storage = createMMKV({ id: 'app' });
export const userStorage = createMMKV({ id: 'user' }); // Loaded only when needed
```

---

## Advanced: Optional Supabase Integration

The template includes commented-out Supabase code. To enable:

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { storage } from './storage';

const MMKVStorage = {
  getItem: (key: string) => storage.getString(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
};

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: MMKVStorage, // Use MMKV instead of AsyncStorage!
      persistSession: true,
    },
  }
);
```

This gives you instant backend integration with the same fast storage.

---

## What's Not Included (Intentionally)

To keep the template flexible, I didn't include:

- ❌ Form library (add react-hook-form if needed)
- ❌ Specific UI kit (you have base components)
- ❌ Analytics (add your preferred service)
- ❌ Push notifications (add as needed)

These vary too much between projects. The template provides the foundation; you add what you need.

---

## Maintaining the Template

### Version Control

I tag releases and keep a changelog:

```bash
git tag v1.0.0
git push --tags
```

Update `CHANGELOG.md` with each version.

### Testing

Before releasing updates, I test:

1. Create a new app from template
2. Run through setup wizard
3. Build for iOS and Android
4. Test all example screens
5. Verify auth flow works

### Gathering Feedback

After using the template across projects, I improve it:
- Found a better pattern? Update the template
- Hit a common pain point? Add a helper function
- Client needs a feature? Consider adding to template

---

## Conclusion

Building this template took about a week upfront. But across 5+ projects, I've saved **15+ days of setup time**. More importantly, I have consistency, production-ready code, and can focus on building features instead of infrastructure.

The template continues to evolve as I use it. When I discover a better pattern, I update the template and all future projects benefit.

**If you're building multiple React Native apps, create a template. Your future self will thank you.**

---

## Resources

- **Template Repository:** https://github.com/gigs-slc/premier99software-expo-template
- **Complete Documentation:** See FEATURES.md in the repo
- **Example Project:** Check the `examples` tab in any app created from template

### Key Documentation

The template includes comprehensive docs:
- `README.md` - Quick start
- `FEATURES.md` - Complete feature guide
- `ARCHITECTURE.md` - Design decisions
- `UNISTYLES_MMKV_REFERENCE.md` - v3/v4 patterns

---

## Try It Yourself

Create a new app from the template:

```bash
npx create-expo-app MyTestApp --template https://github.com/gigs-slc/premier99software-expo-template
cd MyTestApp
npm run setup
npx expo prebuild
npx expo run:ios
```

You'll have a fully functional app with authentication, storage, theming, and more—in under 5 minutes.

**Happy building!** 🚀

---

*Griffin Huth is a React Native developer who builds production apps at Premier99 Software. Connect on [GitHub](https://github.com/griffinhuth) or [LinkedIn](https://linkedin.com/in/griffinhuth).*
