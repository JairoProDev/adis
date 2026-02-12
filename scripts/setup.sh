#!/bin/bash

# ============================================================================
# PUBLICADIS - Setup Script
# ============================================================================
# This script helps you set up the project for local development

set -e

echo "🚀 PUBLICADIS - Project Setup"
echo "=============================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo -e "${RED}❌ Node.js 20+ is required. Current version: $(node -v)${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Node.js version: $(node -v)${NC}"
echo ""

# Check npm version
echo "📦 Checking npm version..."
NPM_VERSION=$(npm -v | cut -d'.' -f1)
if [ "$NPM_VERSION" -lt 10 ]; then
  echo -e "${RED}❌ npm 10+ is required. Current version: $(npm -v)${NC}"
  exit 1
fi
echo -e "${GREEN}✅ npm version: $(npm -v)${NC}"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
if ! npm install; then
  echo -e "${YELLOW}⚠️  Standard install failed, trying with --legacy-peer-deps...${NC}"
  npm install --legacy-peer-deps
fi
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Check if Docker is running
echo "🐳 Checking Docker..."
if docker info > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Docker is running${NC}"
  
  # Start Docker services
  echo "🐳 Starting PostgreSQL and Redis containers..."
  docker-compose up -d
  
  echo "⏳ Waiting for services to be ready..."
  sleep 5
  
  # Check if PostgreSQL is ready
  until docker exec publicadis-postgres pg_isready -U postgres > /dev/null 2>&1; do
    echo "⏳ Waiting for PostgreSQL..."
    sleep 2
  done
  echo -e "${GREEN}✅ PostgreSQL is ready${NC}"
  
  # Check if Redis is ready
  until docker exec publicadis-redis redis-cli ping > /dev/null 2>&1; do
    echo "⏳ Waiting for Redis..."
    sleep 2
  done
  echo -e "${GREEN}✅ Redis is ready${NC}"
else
  echo -e "${YELLOW}⚠️  Docker is not running. Please start Docker and run: docker-compose up -d${NC}"
fi
echo ""

# Generate Prisma Client
echo "🗄️  Generating Prisma Client..."
npm run db:generate
echo -e "${GREEN}✅ Prisma Client generated${NC}"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
  echo -e "${YELLOW}⚠️  .env.local not found${NC}"
  echo "📝 Creating .env.local from template..."
  
  cat > .env.local << EOF
# ============================================================================
# PUBLICADIS - ENVIRONMENT VARIABLES
# ============================================================================
# Fill in your values below

NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/publicadis?schema=public

# Redis
REDIS_URL=redis://localhost:6379

# API
PORT=4000
API_URL=http://localhost:4000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# JWT (Generate with: openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=7d

# Email (Optional - Get from https://resend.com)
RESEND_API_KEY=
EMAIL_FROM=Publicadis <noreply@publicadis.com>

# File Uploads (Optional - Get from Cloudflare R2)
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_ACCESS_KEY_ID=
CLOUDFLARE_SECRET_ACCESS_KEY=
CLOUDFLARE_BUCKET_NAME=publicadis-uploads

# Payments (Optional - Get from https://dashboard.stripe.com)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
FRONTEND_URL=http://localhost:3000

# AI (Optional - Get from https://console.groq.com)
GROQ_API_KEY=

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100
EOF
  
  echo -e "${GREEN}✅ .env.local created${NC}"
  echo -e "${YELLOW}⚠️  Please edit .env.local and add your API keys${NC}"
else
  echo -e "${GREEN}✅ .env.local already exists${NC}"
fi
echo ""

# Create frontend .env.local files
if [ ! -f "apps/marketplace/.env.local" ]; then
  echo "📝 Creating apps/marketplace/.env.local..."
  echo "NEXT_PUBLIC_API_URL=http://localhost:4000/graphql" > apps/marketplace/.env.local
  echo -e "${GREEN}✅ Created${NC}"
fi

if [ ! -f "apps/pages/.env.local" ]; then
  echo "📝 Creating apps/pages/.env.local..."
  echo "NEXT_PUBLIC_API_URL=http://localhost:4000/graphql" > apps/pages/.env.local
  echo -e "${GREEN}✅ Created${NC}"
fi
echo ""

# Run database migrations
echo "🗄️  Running database migrations..."
npm run db:push
echo -e "${GREEN}✅ Database migrations completed${NC}"
echo ""

# Seed database (optional)
read -p "🌱 Do you want to seed the database with demo data? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "🌱 Seeding database..."
  npm run db:seed
  echo -e "${GREEN}✅ Database seeded${NC}"
fi
echo ""

echo "=============================="
echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
echo ""
echo "📋 Next steps:"
echo "   1. Review and update .env.local with your API keys"
echo "   2. Start the development servers:"
echo "      npm run dev"
echo ""
echo "🌐 URLs:"
echo "   - API: http://localhost:4000"
echo "   - GraphQL Playground: http://localhost:4000/graphql"
echo "   - Pages App: http://localhost:3000"
echo "   - Marketplace App: http://localhost:3001"
echo ""
echo "🔑 Test Credentials (if seeded):"
echo "   Admin: admin@publicadis.com / admin123"
echo "   Seller: seller1@test.com / password123"
echo "   Buyer: buyer@test.com / password123"
echo ""

