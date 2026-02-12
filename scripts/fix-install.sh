#!/bin/bash

# ============================================================================
# PUBLICADIS - Fix Installation Script
# ============================================================================

set -e

echo "🔧 PUBLICADIS - Fixing Installation Issues"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Clean everything
echo "🧹 Cleaning old installations..."
rm -rf node_modules
rm -rf package-lock.json
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
rm -rf apps/*/.next
rm -rf apps/*/dist
echo -e "${GREEN}✅ Cleaned${NC}"
echo ""

# Clear npm cache
echo "🗑️  Clearing npm cache..."
npm cache clean --force
echo -e "${GREEN}✅ Cache cleared${NC}"
echo ""

# Install dependencies
echo "📦 Installing dependencies (this may take a few minutes)..."
npm install --legacy-peer-deps
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Verify turbo is installed
echo "🔍 Verifying turbo installation..."
if [ -f "node_modules/.bin/turbo" ]; then
  echo -e "${GREEN}✅ Turbo is installed${NC}"
  ./node_modules/.bin/turbo --version
else
  echo -e "${RED}❌ Turbo not found, installing...${NC}"
  npm install turbo@^2.3.3 --save-dev --legacy-peer-deps
fi
echo ""

echo "=========================================="
echo -e "${GREEN}🎉 Installation fixed!${NC}"
echo ""
echo "📋 Next steps:"
echo "   1. Run: npm run dev"
echo ""

