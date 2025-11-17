# How to Use This Template

Your React Native/Expo template is now live on GitHub! 🎉

## Repository
**https://github.com/gigs-slc/premier99software-expo-template**

---

## Creating a New App From This Template

### Method 1: Via Command Line (Easiest)

```bash
# Create a new app from your template
npx create-expo-app MyNewApp --template https://github.com/gigs-slc/premier99software-expo-template

# Navigate to the project
cd MyNewApp

# The setup wizard runs automatically via postinstall
# If it didn't run or you want to run it again:
npm run setup

# Build and run
npx expo prebuild
npx expo run:ios
# or
npx expo run:android
```

### Method 2: Via GitHub UI

1. Go to https://github.com/gigs-slc/premier99software-expo-template
2. Click the green "Use this template" button
3. Create a new repository from the template
4. Clone your new repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/your-new-app.git
   cd your-new-app
   npm install
   npm run setup
   ```

---

## What Happens During Setup

The interactive setup wizard will ask you:

1. **App name** - e.g., "Client Project App"
2. **Package name** - e.g., "com.premier99.clientapp"
3. **Primary color** - Your brand color (hex)
4. **Secondary color** - Accent color (hex)
5. **Include authentication?** - Keep the auth screens or remove them
6. **Set up Supabase?** - Configure backend or skip

Then it automatically:
- Updates `app.json` with your app name and package ID
- Updates theme colors in `src/styles/theme.ts`
- Creates `.env` file with encryption key
- Installs Supabase dependencies (if you chose yes)
- Removes auth screens (if you chose no)

---

## After Creating Your App

### 1. Start Development

```bash
# Start the dev server
npm start

# Or run on device/simulator
npx expo run:ios
npx expo run:android
```

### 2. Customize Further

**Update app icon and splash:**
- Replace images in `src/assets/images/`
- Run `npx expo prebuild` to update native projects

**Add your API endpoints:**
- Create query hooks in `src/hooks/queries/`
- Follow the pattern in `useExampleQuery.ts`

**Add more screens:**
- Create files in `src/app/` (they auto-route with Expo Router)
- Example: `src/app/settings.tsx` → `/settings`

**Customize theme:**
- Edit `src/styles/theme.ts`
- Or use the generator in `src/styles/themeGenerator.ts`

### 3. Remove Example Code

```bash
# Remove the examples tab
rm src/app/(tabs)/examples.tsx

# Update _layout.tsx to remove the tab
# Edit src/app/(tabs)/_layout.tsx

# Remove the old "two" tab
rm src/app/(tabs)/two.tsx
```

---

## Common Commands

```bash
npm start              # Start Expo dev server
npm run ios            # Run on iOS simulator
npm run android        # Run on Android emulator
npm run web            # Run in browser
npm run setup          # Re-run setup wizard
```

---

## Template Features You Get

✅ **MMKV v4 Storage**
- Use: `import { storageHelpers } from '@/lib/storage'`
- Fast encrypted storage for all your data

✅ **Zustand State Management**
- Use: `import { useAuthStore } from '@/stores'`
- Global state with automatic persistence

✅ **TanStack Query**
- Use: Follow patterns in `src/hooks/queries/useExampleQuery.ts`
- Data fetching with caching

✅ **Unistyles v3 Theming**
- Use: `import { StyleSheet } from 'react-native-unistyles'`
- No hooks needed, just `StyleSheet.create((theme) => ({...}))`

✅ **UI Components**
- Use: `import { Button, Card, Input, Typography } from '@/components/ui'`
- Pre-built, themeable components

✅ **Authentication**
- Pre-built sign-in, sign-up, forgot password screens
- Integrated with Zustand and MMKV

---

## Example: Creating Your First Feature

Let's create a "Notes" feature:

### 1. Create a Zustand Store

```typescript
// src/stores/notesStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '@/lib/storage';

export const useNotesStore = create(
  persist(
    (set) => ({
      notes: [],
      addNote: (note) => set((state) => ({
        notes: [...state.notes, note]
      })),
      deleteNote: (id) => set((state) => ({
        notes: state.notes.filter(n => n.id !== id)
      })),
    }),
    {
      name: 'notes-storage',
      storage: createJSONStorage(() => storage),
    }
  )
);
```

### 2. Create a Screen

```typescript
// src/app/notes.tsx
import { View, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Button, Card, Input, Typography } from '@/components/ui';
import { useNotesStore } from '@/stores/notesStore';
import { useState } from 'react';

export default function NotesScreen() {
  const { notes, addNote } = useNotesStore();
  const [newNote, setNewNote] = useState('');

  const handleAdd = () => {
    if (newNote.trim()) {
      addNote({ id: Date.now(), text: newNote });
      setNewNote('');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Typography variant="h1">My Notes</Typography>

      <Input
        value={newNote}
        onChangeText={setNewNote}
        placeholder="Enter a note"
      />
      <Button title="Add Note" onPress={handleAdd} />

      {notes.map((note) => (
        <Card key={note.id}>
          <Typography>{note.text}</Typography>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
}));
```

That's it! Your notes are automatically persisted to MMKV storage.

---

## Need Help?

- **Documentation**: Check `README.md`, `ARCHITECTURE.md`, and `UNISTYLES_MMKV_REFERENCE.md`
- **Examples**: Look at `src/app/(tabs)/examples.tsx` for usage patterns
- **Issues**: Open an issue on GitHub

---

## Updating Your Apps When Template Changes

When you update the template:

1. **For existing apps**: Manually copy files you want
2. **For new apps**: Just use the latest template

```bash
# Create new app with latest template
npx create-expo-app NewApp --template https://github.com/gigs-slc/premier99software-expo-template
```

---

Happy coding! 🚀
