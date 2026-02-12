#!/bin/bash

# ============================================================================
# PUBLICADIS - Force Install Everything
# ============================================================================

set -e

echo "🔧 FORCE INSTALLING EVERYTHING"
echo "==============================="
echo ""

# Clean
echo "🧹 Cleaning..."
rm -rf node_modules package-lock.json
find apps -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
find packages -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
echo "✅ Cleaned"
echo ""

# Clear cache
echo "🗑️  Clearing npm cache..."
npm cache clean --force
echo "✅ Cache cleared"
echo ""

# Install root dependencies first
echo "📦 Installing root dependencies..."
npm install --legacy-peer-deps --no-audit --no-fund
echo "✅ Root dependencies installed"
echo ""

# Verify turbo
echo "🔍 Checking turbo..."
if [ -f "node_modules/.bin/turbo" ]; then
  echo "✅ Turbo installed successfully"
  ls -la node_modules/.bin/turbo
  ./node_modules/.bin/turbo --version
else
  echo "❌ Turbo not found in node_modules/.bin/"
  echo "📦 Manually installing turbo..."
  npm install turbo@2.3.3 --save-dev --legacy-peer-deps
  
  if [ -f "node_modules/.bin/turbo" ]; then
    echo "✅ Turbo now installed"
  else
    echo "❌ Turbo installation failed. Listing node_modules/.bin:"
    ls -la node_modules/.bin/ || echo "node_modules/.bin not found"
  fi
fi
echo ""

echo "==============================="
echo "🎉 Installation complete!"
echo ""
echo "Try now: npm run dev"
echo ""

