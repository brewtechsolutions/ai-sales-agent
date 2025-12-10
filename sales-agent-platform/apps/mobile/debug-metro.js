/**
 * Metro Bundler Debug Script
 * 
 * This script helps identify which module is causing the 99.9% hang.
 * Run: node debug-metro.js
 */

const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

console.log('🔍 Analyzing Metro bundler dependencies...\n');

// Check for potential problematic imports
const checkFile = (filePath, relativePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    // Check for imports from backend/admin
    if (content.includes('apps/backend') || content.includes('apps/admin')) {
      issues.push('⚠️  Imports from backend/admin apps');
    }
    
    // Check for Prisma imports
    if (content.includes('@prisma') || content.includes('prisma/')) {
      issues.push('⚠️  Prisma imports (server-only)');
    }
    
    // Check for problematic dynamic imports
    const dynamicImports = content.match(/import\([^)]+\)/g);
    if (dynamicImports && dynamicImports.length > 5) {
      issues.push(`⚠️  Many dynamic imports (${dynamicImports.length})`);
    }
    
    // Check for require.context (can cause issues)
    if (content.includes('require.context')) {
      issues.push('⚠️  Uses require.context');
    }
    
    if (issues.length > 0) {
      console.log(`📄 ${relativePath}`);
      issues.forEach(issue => console.log(`   ${issue}`));
      console.log('');
    }
  } catch (err) {
    // File might not exist or be binary
  }
};

// Scan app directory
const scanDirectory = (dir, baseDir = '') => {
  try {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const relativePath = path.join(baseDir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        scanDirectory(fullPath, relativePath);
      } else if (file.match(/\.(ts|tsx|js|jsx)$/)) {
        checkFile(fullPath, relativePath);
      }
    });
  } catch (err) {
    // Directory might not exist
  }
};

console.log('Scanning app directory for potential issues...\n');
scanDirectory(path.join(projectRoot, 'app'));

console.log('\n✅ Scan complete!');
console.log('\n💡 Tips:');
console.log('   - If you see imports from backend/admin, add them to metro.config.js blockList');
console.log('   - Dynamic imports can cause Metro to hang - consider using static imports');
console.log('   - The 99.9% hang might just be a display issue - check if your app actually loads');

