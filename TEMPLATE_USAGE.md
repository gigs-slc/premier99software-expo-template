# Template Usage Guide

This document explains how to publish and use this React Native template.

## Publishing the Template

You have three options for making this template reusable:

### Option 1: GitHub Template (Easiest)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial template setup"
   git remote add origin https://github.com/yourusername/premier99softwaretemplate.git
   git push -u origin main
   ```

2. **Make it a GitHub Template:**
   - Go to your repo on GitHub
   - Click "Settings"
   - Check "Template repository"

3. **Use the template:**
   ```bash
   # Via GitHub UI: Click "Use this template" button

   # Or via CLI:
   npx create-expo-app my-new-app --template https://github.com/yourusername/premier99softwaretemplate
   ```

### Option 2: NPM Package (Most Professional)

1. **Update package.json:**
   - Change `author` to your name/email
   - Change `repository.url` to your GitHub URL
   - Ensure `"private"` is removed (already done)

2. **Create NPM account:**
   ```bash
   npm login
   ```

3. **Publish to NPM:**
   ```bash
   npm publish
   ```

4. **Use the template:**
   ```bash
   npx create-expo-app my-new-app --template premier99-react-native-template

   # Or with yarn:
   yarn create expo-app my-new-app --template premier99-react-native-template
   ```

### Option 3: Local Template (Development)

Keep it local and copy manually:

```bash
# Create a script to copy the template
cp -r /path/to/premier99softwaretemplate /path/to/new-project
cd /path/to/new-project
npm install
npm run setup
```

## Using the Template

Once published, anyone can create a new app:

### Method 1: With Expo CLI (Recommended)

```bash
# From NPM (if published)
npx create-expo-app MyAwesomeApp --template premier99-react-native-template

# From GitHub
npx create-expo-app MyAwesomeApp --template https://github.com/yourusername/premier99softwaretemplate

# Navigate to your new app
cd MyAwesomeApp

# Run the setup wizard (automatically runs via postinstall)
# Or run manually:
npm run setup

# Install dependencies
npm install

# Prebuild native code
npx expo prebuild

# Start developing
npx expo run:ios
# or
npx expo run:android
```

### Method 2: Clone and Customize

```bash
# Clone the repository
git clone https://github.com/yourusername/premier99softwaretemplate.git my-new-app
cd my-new-app

# Remove git history
rm -rf .git
git init

# Run setup
npm install
npm run setup

# Start developing
npx expo prebuild
npx expo run:ios
```

## Template Customization Workflow

After creating a new app from the template:

1. **Run Setup Wizard:**
   ```bash
   npm run setup
   ```
   This prompts for:
   - App name
   - Package identifier
   - Theme colors
   - Optional features (Supabase, auth)

2. **Manual Customization:**
   - Update `app.json` with your app details
   - Change theme in `src/styles/theme.ts`
   - Add your logo/assets
   - Configure environment variables in `.env`

3. **Remove Unwanted Features:**
   ```bash
   # Remove auth screens
   rm -rf src/app/(auth)

   # Remove example screens
   rm src/app/(tabs)/examples.tsx
   ```

4. **Add Your Features:**
   - Follow the patterns in example screens
   - Use the UI components from `src/components/ui`
   - Add your API calls using TanStack Query
   - Store state in Zustand stores

## Keeping Your Apps Updated

When the template is updated:

1. **Check the CHANGELOG:**
   - See what's new in the latest version
   - Check for breaking changes

2. **Update Dependencies:**
   ```bash
   npm install premier99-react-native-template@latest
   # Review changes and merge what you need
   ```

3. **Manual Updates:**
   - Copy specific files you want to update
   - Review diffs before applying
   - Test thoroughly

## Creating Your Own Variant

To fork and customize this template:

1. **Clone and rename:**
   ```bash
   git clone https://github.com/yourusername/premier99softwaretemplate.git my-custom-template
   cd my-custom-template
   ```

2. **Update package.json:**
   ```json
   {
     "name": "my-custom-template",
     "description": "My customized version",
     "version": "1.0.0"
   }
   ```

3. **Customize:**
   - Change default theme
   - Add your preferred libraries
   - Update documentation
   - Add company-specific patterns

4. **Publish:**
   ```bash
   npm publish
   ```

5. **Use your custom template:**
   ```bash
   npx create-expo-app my-app --template my-custom-template
   ```

## Best Practices

### For Template Maintainers

1. **Version Control:**
   - Tag releases: `git tag v1.0.0`
   - Follow semantic versioning
   - Update CHANGELOG.md

2. **Testing:**
   - Test template creation regularly
   - Ensure setup script works
   - Verify all examples run correctly

3. **Documentation:**
   - Keep README updated
   - Document breaking changes
   - Provide migration guides

### For Template Users

1. **Don't Modify Template Files Directly:**
   - Copy template to new project first
   - Make your changes in the new project
   - This keeps template updates easier

2. **Track Your Customizations:**
   - Document what you changed
   - Makes updating from template easier
   - Helps team members understand deviations

3. **Contribute Back:**
   - Found a bug? Open an issue
   - Improved something? Submit a PR
   - Help make the template better for everyone

## Troubleshooting

### "Template not found"

**Problem:** NPM can't find the template

**Solutions:**
- Ensure template is published: `npm view premier99-react-native-template`
- Check spelling of template name
- Try with full GitHub URL instead

### "Setup script fails"

**Problem:** Postinstall script errors

**Solutions:**
- Run setup manually: `npm run setup`
- Check Node.js version (requires Node 18+)
- Ensure all dependencies installed

### "Native modules not found"

**Problem:** MMKV or other native modules fail

**Solutions:**
- Run prebuild: `npx expo prebuild`
- Clean and rebuild:
  ```bash
  rm -rf node_modules
  npm install
  npx expo prebuild --clean
  npx expo run:ios
  ```

## Support

- **Issues:** https://github.com/yourusername/premier99softwaretemplate/issues
- **Discussions:** https://github.com/yourusername/premier99softwaretemplate/discussions
- **Documentation:** See README.md and ARCHITECTURE.md

## License

MIT - Use freely in commercial and personal projects!
