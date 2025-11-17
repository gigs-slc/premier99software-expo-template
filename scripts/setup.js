#!/usr/bin/env node

/**
 * React Native Template Setup Script
 *
 * This script runs after template installation to customize the app:
 * - Prompt for app name and package identifier
 * - Customize theme colors
 * - Enable/disable optional features (Supabase, auth screens)
 * - Generate .env file
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const config = {
  appName: '',
  packageName: '',
  primaryColor: '#007AFF',
  secondaryColor: '#6366F1',
  includeSupabase: false,
  includeAuth: true,
  supabaseUrl: '',
  supabaseAnonKey: '',
};

console.log('\n🚀 Welcome to React Native Template Setup!\n');
console.log('This will help you customize your new app.\n');

// Promisify readline question
function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function run() {
  try {
    // Step 1: App Name
    const appName = await question('App name (e.g., "My Awesome App"): ');
    config.appName = appName || 'My App';

    // Step 2: Package Name
    const packageName = await question(
      'Package name (e.g., "com.company.myapp"): '
    );
    config.packageName = packageName || 'com.example.app';

    // Step 3: Primary Color
    console.log('\n🎨 Theme Customization');
    const primaryColor = await question(
      'Primary color (hex, default #007AFF): '
    );
    config.primaryColor = primaryColor || '#007AFF';

    const secondaryColor = await question(
      'Secondary color (hex, default #6366F1): '
    );
    config.secondaryColor = secondaryColor || '#6366F1';

    // Step 4: Features
    console.log('\n✨ Optional Features');

    const includeAuth = await question(
      'Include authentication screens? (Y/n): '
    );
    config.includeAuth = includeAuth.toLowerCase() !== 'n';

    const includeSupabase = await question(
      'Set up Supabase? (y/N): '
    );
    config.includeSupabase = includeSupabase.toLowerCase() === 'y';

    if (config.includeSupabase) {
      config.supabaseUrl = await question('Supabase URL: ');
      config.supabaseAnonKey = await question('Supabase Anon Key: ');
    }

    console.log('\n⚙️  Configuring your app...\n');

    // Apply configuration
    await updateAppConfig();
    await updateTheme();
    await createEnvFile();
    await updatePackageJson();

    if (config.includeSupabase) {
      await setupSupabase();
    }

    if (!config.includeAuth) {
      await removeAuthScreens();
    }

    console.log('\n✅ Setup complete!\n');
    console.log('Next steps:');
    console.log('  1. npm install (or yarn install)');
    console.log('  2. npx expo prebuild');
    console.log('  3. npx expo run:ios (or run:android)\n');
    console.log('Happy coding! 🎉\n');
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

async function updateAppConfig() {
  const appJsonPath = path.join(process.cwd(), 'app.json');
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

  appJson.expo.name = config.appName;
  appJson.expo.slug = config.appName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  if (appJson.expo.ios) {
    appJson.expo.ios.bundleIdentifier = config.packageName;
  }

  if (appJson.expo.android) {
    appJson.expo.android.package = config.packageName;
  }

  fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
  console.log('✓ Updated app.json');
}

async function updateTheme() {
  const themePath = path.join(process.cwd(), 'src/styles/theme.ts');
  let themeContent = fs.readFileSync(themePath, 'utf8');

  // Update light theme primary color
  themeContent = themeContent.replace(
    /primary: '#[0-9A-Fa-f]{6}',(\s+)\/\/ iOS-style blue/,
    `primary: '${config.primaryColor}',$1// Your brand color`
  );

  // Update light theme secondary color
  themeContent = themeContent.replace(
    /secondary: '#[0-9A-Fa-f]{6}',(\s+)\/\/ Indigo accent/,
    `secondary: '${config.secondaryColor}',$1// Accent color`
  );

  fs.writeFileSync(themePath, themeContent);
  console.log('✓ Updated theme colors');
}

async function createEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  let envContent = '';

  // Generate a simple encryption key
  const encryptionKey = Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  envContent += `# MMKV Encryption Key\n`;
  envContent += `EXPO_PUBLIC_MMKV_ENCRYPTION_KEY=${encryptionKey}\n\n`;

  if (config.includeSupabase) {
    envContent += `# Supabase Configuration\n`;
    envContent += `EXPO_PUBLIC_SUPABASE_URL=${config.supabaseUrl}\n`;
    envContent += `EXPO_PUBLIC_SUPABASE_ANON_KEY=${config.supabaseAnonKey}\n`;
  }

  fs.writeFileSync(envPath, envContent);
  console.log('✓ Created .env file');
}

async function updatePackageJson() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  packageJson.name = config.appName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✓ Updated package.json');
}

async function setupSupabase() {
  // Install Supabase dependencies
  console.log('Installing Supabase dependencies...');
  try {
    execSync('npm install @supabase/supabase-js', { stdio: 'inherit' });
  } catch (error) {
    console.warn('⚠️  Failed to install Supabase. Run: npm install @supabase/supabase-js');
  }

  // Uncomment Supabase code in lib/supabase.ts
  const supabasePath = path.join(process.cwd(), 'src/lib/supabase.ts');
  let supabaseContent = fs.readFileSync(supabasePath, 'utf8');

  // Remove comment markers
  supabaseContent = supabaseContent.replace(/\/\/ import/g, 'import');
  supabaseContent = supabaseContent.replace(/\/\/ const/g, 'const');
  supabaseContent = supabaseContent.replace(/\/\/ export/g, 'export');
  supabaseContent = supabaseContent.replace(/\/\/ \}/g, '}');
  supabaseContent = supabaseContent.replace(/\/\/   /g, '  ');

  // Update the enabled flag
  supabaseContent = supabaseContent.replace(
    /export const supabaseEnabled = false;/,
    'export const supabaseEnabled = true;'
  );

  // Remove placeholder export
  supabaseContent = supabaseContent.replace(
    /\/\/ Placeholder export to prevent import errors\nexport const supabase = null;/,
    ''
  );

  fs.writeFileSync(supabasePath, supabaseContent);
  console.log('✓ Configured Supabase');
}

async function removeAuthScreens() {
  const authDir = path.join(process.cwd(), 'src/app/(auth)');

  if (fs.existsSync(authDir)) {
    fs.rmSync(authDir, { recursive: true, force: true });
    console.log('✓ Removed authentication screens');
  }
}

// Run the script
run();
