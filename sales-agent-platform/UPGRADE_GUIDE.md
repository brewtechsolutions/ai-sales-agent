# Dependency Upgrade Guide

This guide explains how to upgrade dependencies across all apps and packages in this monorepo.

## Quick Commands

### ✅ Safe Upgrade (Recommended)
Upgrades dependencies to the latest **compatible** versions within their semver ranges. This is the safest option and won't introduce breaking changes.

```bash
bun run upgrade
# or directly:
bun update
```

**What it does:**
- Updates all dependencies in all workspaces (apps/* and packages/*)
- Respects semver ranges (e.g., `^3.5.3` stays within `^3.x.x`)
- Safe and non-breaking
- Updates lockfile automatically

### ⚠️ Latest Versions (Use with Caution)
Upgrades dependencies to the **absolute latest** versions, which may include breaking changes.

```bash
bun run upgrade:latest
```

**What it does:**
- Uses `npm-check-updates` to update all package.json files
- Updates to absolute latest versions (may break semver ranges)
- Requires manual review and testing
- May introduce breaking changes

## How It Works

### Safe Upgrade (`bun update`)
Bun's built-in `update` command:
1. Scans all workspaces defined in root `package.json`
2. Checks for newer versions within semver ranges
3. Updates `bun.lockb` lockfile
4. Installs updated packages

**Example:**
- If you have `"prettier": "^3.5.3"`, it will update to `^3.6.2` (latest 3.x)
- It will NOT update to `4.0.0` (would require changing to `^4.0.0`)

### Latest Upgrade (`bun run upgrade:latest`)
The upgrade script:
1. Finds all `package.json` files in `apps/` and `packages/`
2. Runs `npm-check-updates` on each to update version numbers
3. Runs `bun install` to install the new versions

**Example:**
- If you have `"prettier": "^3.5.3"`, it will update to `"prettier": "^4.0.0"` (if available)
- You'll need to test for breaking changes

## Best Practices

### 1. Regular Safe Upgrades
Run safe upgrades regularly to get bug fixes and minor updates:
```bash
bun run upgrade
```

### 2. Before Major Upgrades
When you want to upgrade to latest versions:
1. **Commit your current work** (in case you need to revert)
2. Run the upgrade:
   ```bash
   bun run upgrade:latest
   ```
3. **Review the changes** in each `package.json`
4. **Test thoroughly**:
   ```bash
   bun run lint
   bun run check-types
   bun run build
   bun run dev  # Test each app
   ```
5. **Fix any breaking changes**
6. **Commit the updates**

### 3. Per-App Upgrades
You can also upgrade dependencies for a specific app:
```bash
cd apps/admin
bun update
```

## Troubleshooting

### Lockfile Conflicts
If you see lockfile conflicts after upgrading:
```bash
rm -rf node_modules bun.lockb
bun install
```

### Type Errors After Upgrade
If TypeScript errors appear:
1. Check if `@types/*` packages need updating
2. Run `bun run check-types` to see all errors
3. Update type definitions if needed

### Build Failures
If builds fail after upgrading:
1. Check the error messages
2. Review changelogs for breaking changes
3. Update your code to match new APIs
4. Consider reverting if the upgrade isn't critical

## What Gets Updated

The upgrade commands update dependencies in:
- ✅ Root `package.json` (devDependencies)
- ✅ `apps/admin/package.json`
- ✅ `apps/backend/package.json`
- ✅ `apps/mobile/package.json`
- ✅ `packages/ui/package.json`
- ✅ `packages/eslint-config/package.json`
- ✅ `packages/typescript-config/package.json`

## Version Ranges Explained

- `^3.5.3` - Allows updates to any `3.x.x` version (safe upgrade compatible)
- `~3.5.3` - Allows updates to any `3.5.x` version (more restrictive)
- `3.5.3` - Exact version (no auto-updates)
- `*` or `latest` - Always uses latest (not recommended)

## Need Help?

- Check package changelogs: `npm view <package> changelog`
- Review breaking changes: `npm view <package> versions`
- Test incrementally: Upgrade one app at a time

