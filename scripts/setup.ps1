# ============================================================================
# PUBLICADIS - Setup Script (PowerShell)
# ============================================================================
# This script helps you set up the project for local development on Windows

Write-Host "🚀 PUBLICADIS - Project Setup" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js version
Write-Host "📦 Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node -v
$nodeMajor = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
if ($nodeMajor -lt 20) {
    Write-Host "❌ Node.js 20+ is required. Current version: $nodeVersion" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
Write-Host ""

# Check npm version
Write-Host "📦 Checking npm version..." -ForegroundColor Yellow
$npmVersion = npm -v
$npmMajor = [int]($npmVersion -split '\.')[0]
if ($npmMajor -lt 10) {
    Write-Host "❌ npm 10+ is required. Current version: $npmVersion" -ForegroundColor Red
    exit 1
}
Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
Write-Host ""

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
if (-not (npm install 2>$null)) {
    Write-Host "⚠️  Standard install failed, trying with --legacy-peer-deps..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Check if Docker is running
Write-Host "🐳 Checking Docker..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
    
    # Start Docker services
    Write-Host "🐳 Starting PostgreSQL and Redis containers..." -ForegroundColor Yellow
    docker-compose up -d
    
    Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    # Check PostgreSQL
    $maxRetries = 30
    $retryCount = 0
    while ($retryCount -lt $maxRetries) {
        try {
            docker exec publicadis-postgres pg_isready -U postgres | Out-Null
            Write-Host "✅ PostgreSQL is ready" -ForegroundColor Green
            break
        } catch {
            $retryCount++
            Write-Host "⏳ Waiting for PostgreSQL... ($retryCount/$maxRetries)" -ForegroundColor Yellow
            Start-Sleep -Seconds 2
        }
    }
    
    # Check Redis
    $retryCount = 0
    while ($retryCount -lt $maxRetries) {
        try {
            docker exec publicadis-redis redis-cli ping | Out-Null
            Write-Host "✅ Redis is ready" -ForegroundColor Green
            break
        } catch {
            $retryCount++
            Write-Host "⏳ Waiting for Redis... ($retryCount/$maxRetries)" -ForegroundColor Yellow
            Start-Sleep -Seconds 2
        }
    }
} catch {
    Write-Host "⚠️  Docker is not running. Please start Docker and run: docker-compose up -d" -ForegroundColor Yellow
}
Write-Host ""

# Generate Prisma Client
Write-Host "🗄️  Generating Prisma Client..." -ForegroundColor Yellow
npm run db:generate
Write-Host "✅ Prisma Client generated" -ForegroundColor Green
Write-Host ""

# Check if .env.local exists
if (-Not (Test-Path ".env.local")) {
    Write-Host "⚠️  .env.local not found" -ForegroundColor Yellow
    Write-Host "📝 Creating .env.local from template..." -ForegroundColor Yellow
    
    # Generate JWT secret
    $jwtSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
    
    @"
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

# JWT
JWT_SECRET=$jwtSecret
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
"@ | Out-File -FilePath ".env.local" -Encoding utf8
    
    Write-Host "✅ .env.local created" -ForegroundColor Green
    Write-Host "⚠️  Please edit .env.local and add your API keys" -ForegroundColor Yellow
} else {
    Write-Host "✅ .env.local already exists" -ForegroundColor Green
}
Write-Host ""

# Create frontend .env.local files
if (-Not (Test-Path "apps/marketplace/.env.local")) {
    Write-Host "📝 Creating apps/marketplace/.env.local..." -ForegroundColor Yellow
    "NEXT_PUBLIC_API_URL=http://localhost:4000/graphql" | Out-File -FilePath "apps/marketplace/.env.local" -Encoding utf8
    Write-Host "✅ Created" -ForegroundColor Green
}

if (-Not (Test-Path "apps/pages/.env.local")) {
    Write-Host "📝 Creating apps/pages/.env.local..." -ForegroundColor Yellow
    "NEXT_PUBLIC_API_URL=http://localhost:4000/graphql" | Out-File -FilePath "apps/pages/.env.local" -Encoding utf8
    Write-Host "✅ Created" -ForegroundColor Green
}
Write-Host ""

# Run database migrations
Write-Host "🗄️  Running database migrations..." -ForegroundColor Yellow
npm run db:push
Write-Host "✅ Database migrations completed" -ForegroundColor Green
Write-Host ""

# Seed database (optional)
$seed = Read-Host "🌱 Do you want to seed the database with demo data? (y/n)"
if ($seed -eq "y" -or $seed -eq "Y") {
    Write-Host "🌱 Seeding database..." -ForegroundColor Yellow
    npm run db:seed
    Write-Host "✅ Database seeded" -ForegroundColor Green
}
Write-Host ""

Write-Host "==============================" -ForegroundColor Cyan
Write-Host "🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Review and update .env.local with your API keys"
Write-Host "   2. Start the development servers:"
Write-Host "      npm run dev"
Write-Host ""
Write-Host "🌐 URLs:" -ForegroundColor Yellow
Write-Host "   - API: http://localhost:4000"
Write-Host "   - GraphQL Playground: http://localhost:4000/graphql"
Write-Host "   - Pages App: http://localhost:3000"
Write-Host "   - Marketplace App: http://localhost:3001"
Write-Host ""
Write-Host "🔑 Test Credentials (if seeded):" -ForegroundColor Yellow
Write-Host "   Admin: admin@publicadis.com / admin123"
Write-Host "   Seller: seller1@test.com / password123"
Write-Host "   Buyer: buyer@test.com / password123"
Write-Host ""

