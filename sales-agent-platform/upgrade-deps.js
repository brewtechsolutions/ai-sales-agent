#!/usr/bin/env node
/**
 * Upgrade all dependencies across all apps and packages to latest versions
 * 
 * This script uses npm-check-updates to upgrade package.json files to the
 * absolute latest versions (may include breaking changes).
 * 
 * Usage:
 *   bun run upgrade:latest
 *   node upgrade-deps.js
 */

import { execSync } from 'child_process';
import { readdirSync, statSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Find all package.json files in apps and packages
const findPackageJsonFiles = () => {
  const packageJsonFiles = [];
  const appsDir = join(__dirname, 'apps');
  const packagesDir = join(__dirname, 'packages');
  
  const scanDir = (dir) => {
    if (!existsSync(dir)) return;
    
    try {
      const packageJsonPath = join(dir, 'package.json');
      if (existsSync(packageJsonPath)) {
        packageJsonFiles.push(packageJsonPath);
      }
      
      // Scan subdirectories
      const entries = readdirSync(dir);
      for (const entry of entries) {
        const entryPath = join(dir, entry);
        if (statSync(entryPath).isDirectory()) {
          scanDir(entryPath);
        }
      }
    } catch (err) {
      // Ignore errors
    }
  };
  
  scanDir(appsDir);
  scanDir(packagesDir);
  
  // Add root package.json
  const rootPackageJson = join(__dirname, 'package.json');
  if (existsSync(rootPackageJson)) {
    packageJsonFiles.push(rootPackageJson);
  }
  
  return packageJsonFiles;
};

const upgradeDependencies = (packageJsonPath) => {
  const packageDir = dirname(packageJsonPath);
  const relativePath = packageJsonPath.replace(__dirname + '\\', '').replace(__dirname + '/', '');
  
  console.log(`\n📦 Upgrading: ${relativePath}`);
  
  try {
    // Use npm-check-updates to upgrade to latest versions
    console.log(`  → Checking for latest versions...`);
    execSync(`npx -y npm-check-updates -u`, { 
      cwd: packageDir,
      stdio: 'inherit'
    });
    
    console.log(`  ✅ Updated: ${relativePath}`);
  } catch (error) {
    console.error(`  ❌ Error upgrading ${relativePath}:`, error.message);
    throw error;
  }
};

const main = () => {
  console.log('🚀 Starting dependency upgrade to latest versions...');
  console.log('⚠️  Note: This may include breaking changes!\n');
  
  const packageJsonFiles = findPackageJsonFiles();
  console.log(`Found ${packageJsonFiles.length} package.json files:\n`);
  packageJsonFiles.forEach(file => {
    const relative = file.replace(__dirname + '\\', '').replace(__dirname + '/', '');
    console.log(`  - ${relative}`);
  });
  
  // Upgrade each package.json
  for (const packageJsonPath of packageJsonFiles) {
    upgradeDependencies(packageJsonPath);
  }
  
  // Final install at root to ensure workspace consistency
  console.log('\n📦 Installing updated dependencies...');
  try {
    execSync(`bun install`, { 
      cwd: __dirname,
      stdio: 'inherit'
    });
    console.log('\n✅ All dependencies upgraded and installed successfully!');
    console.log('\n💡 Next steps:');
    console.log('   1. Review the changes in package.json files');
    console.log('   2. Run tests: bun run lint && bun run check-types');
    console.log('   3. Test your apps: bun run dev');
  } catch (error) {
    console.error('\n❌ Error during installation:', error.message);
    console.log('\n💡 You may need to run "bun install" manually.');
  }
};

main();

