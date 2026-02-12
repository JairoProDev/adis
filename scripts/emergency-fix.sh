#!/bin/bash

# ============================================================================
# PUBLICADIS - EMERGENCY FIX
# ============================================================================

set -e

echo "🚑 EMERGENCY FIX STARTED"
echo "========================"

# 1. Instalar Prisma 5 específicamente (evitar v7)
echo "📦 Installing Prisma 5..."
npm install prisma@5.22.0 --save-dev --legacy-peer-deps
npm install @prisma/client@5.22.0 --legacy-peer-deps

# 2. Instalar Turbo globalmente y localmente para asegurar
echo "📦 Installing Turbo..."
npm install turbo@2.3.3 --save-dev --legacy-peer-deps
npm install -g turbo@2.3.3 --force

# 3. Generar cliente usando el binario local (no npx genérico)
echo "🗄️  Generating Prisma Client..."
./node_modules/.bin/prisma generate --schema=packages/database/prisma/schema.prisma

echo "✅ Done!"
echo ""
echo "👉 Run now: ./node_modules/.bin/turbo run dev"

