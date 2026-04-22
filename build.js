// build.js
// Custom build script for Lil Jr 2.0 mobile app
// This script can be extended to automate build steps, asset generation, env setup, etc.

const { execSync } = require('child_process');

console.log('Starting custom build process for Lil Jr 2.0 mobile app...');

try {
  // Example: Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Example: Run Expo build (can be changed to eas build or other commands)
  console.log('Building app with Expo...');
  execSync('npx expo export', { stdio: 'inherit' });

  // Add more custom build steps here as needed
  // e.g., asset bundling, QR code generation, env var injection, etc.

  console.log('Build process completed successfully.');
} catch (error) {
  console.error('Build process failed:', error.message);
  process.exit(1);
}
