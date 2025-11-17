# Changelog

All notable changes to this template will be documented in this file.

## [1.0.0] - 2025-01-17

### Initial Release

#### Core Libraries
- **Expo SDK 54** - New Architecture enabled
- **Expo Router 6** - File-based routing
- **MMKV v4** - Fast encrypted storage with `createMMKV()` API
- **React Native Unistyles v3** - No-hooks styling system
- **Zustand 5** - State management with MMKV persistence
- **TanStack Query v5** - Data fetching and caching
- **TypeScript 5.9** - Full type safety
- **React 19.1** - Latest React features

#### Features
- ✅ Pre-configured storage with multiple MMKV instances
- ✅ Zustand stores (auth, theme, app) with persistence
- ✅ TanStack Query setup with example queries/mutations
- ✅ Neutral light/dark theme with customization utilities
- ✅ UI component library (Button, Card, Input, Typography)
- ✅ Authentication flow (sign-in, sign-up, forgot password)
- ✅ Example screens demonstrating all libraries
- ✅ Tab navigation (Home, Examples, Profile)
- ✅ Post-install configuration script
- ✅ Optional Supabase integration (commented out)

#### Documentation
- ✅ Comprehensive README with quick start guide
- ✅ ARCHITECTURE.md explaining design decisions
- ✅ UNISTYLES_MMKV_REFERENCE.md with v3/v4 patterns
- ✅ Inline code comments throughout

#### Developer Experience
- ✅ TypeScript path aliases (`@/`)
- ✅ ESLint/Prettier ready
- ✅ Environment variable template
- ✅ Setup script for customization
- ✅ Well-organized folder structure

### Breaking Changes from Standard Expo Template

- Removed default Expo template components
- Replaced styled-components/emotion with Unistyles
- Added src-based directory structure
- Switched from AsyncStorage to MMKV
- Added Zustand instead of Context API

### Migration from Previous Versions

This is the initial release. Future versions will include migration guides here.

---

## Template Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** - Breaking changes to template structure or core libraries
- **MINOR** - New features, library updates that don't break existing code
- **PATCH** - Bug fixes, documentation updates

### Updating Your App

When a new template version is released:

1. Check the CHANGELOG for breaking changes
2. Update dependencies in `package.json`
3. Review and merge new features you want
4. Test thoroughly before deploying

### Library Version Compatibility

| Template | Expo | React | MMKV | Unistyles | Zustand | TanStack Query |
|----------|------|-------|------|-----------|---------|----------------|
| 1.0.0    | 54.x | 19.x  | 4.x  | 3.x       | 5.x     | 5.x            |

---

## Future Roadmap

Planned features for future releases:

- [ ] Additional UI components (Modal, BottomSheet, etc.)
- [ ] Biometric authentication example
- [ ] Offline-first patterns
- [ ] E2E testing setup (Maestro/Detox)
- [ ] CI/CD configuration examples
- [ ] Internationalization (i18n) setup
- [ ] Analytics integration
- [ ] Error tracking (Sentry)
- [ ] Additional theme presets
- [ ] Form validation examples

Have suggestions? Open an issue or PR!
