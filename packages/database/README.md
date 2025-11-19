# @publicadis/database

Prisma database schema and client for the entire PUBLICADIS ecosystem.

## Features

- 🏢 **Multi-tenant architecture** with tenant isolation
- 💰 **Attribution system** for revenue sharing tracking
- 📊 **JSONB flexibility** for category-specific fields
- 🔐 **Complete auth system** with roles and permissions
- 🤖 **ADIS AI integration** with vector embeddings (pgvector)
- 📱 **All 8 categories** with specialized models
- 💳 **Billing & subscriptions** with revenue sharing
- ⭐ **Reviews & trust** system
- 💬 **Real-time messaging**
- 🚚 **Logistics & escrow**
- 📺 **Live commerce**
- 📊 **Analytics tracking**

## Database Schema Overview

### Core Infrastructure
- `Tenant` - Multi-tenant support (MaaS)
- `User` - Users with attribution tracking
- `Session` - Authentication sessions
- `VerificationToken` - Email/phone verification

### Business & Pages (Linktree Killer)
- `Business` - Publicadis Pages
- `BusinessSocial` - Social media links
- `BusinessHours` - Opening hours
- `BusinessKnowledgeBase` - For ADIS AI

### Marketplace
- `Category` - 8 verticals (Empleos, Servicios, etc.)
- `CategoryField` - Dynamic field definitions
- `Listing` - All listings with JSONB metadata
- `ListingImage` - Multiple images per listing

### Vertical-Specific
- `JobApplication` - For Empleos
- `ServiceBooking` - For Servicios
- More specialized models for each category

### Monetization
- `SubscriptionPlan` - Pricing tiers
- `Subscription` - User/business subscriptions
- `Transaction` - All payments
- `RevenueShare` - Automatic revenue distribution

### Communication
- `Conversation` - Chat conversations
- `Message` - Individual messages
- `ContactEvent` - Contact tracking (phone reveals, etc.)

### Reviews & Trust
- `Review` - Business/listing reviews
- `Verification` - KYC/verification status
- `TrustScore` - Coming soon

### ADIS AI
- `ChatSession` - AI conversations
- `ChatMessage` - Chat history
- `BusinessKnowledgeBase` - RAG data with vector embeddings

### Ads Platform
- `AdCampaign` - Ad campaigns
- `AdCreative` - Ad content
- `AdImpression` / `AdClick` / `AdConversion` - Tracking

### Social Features
- `Post` - User-generated content
- `Comment` - Post comments
- `Like` - Likes
- `Follow` - User follows

### Logistics & Escrow
- `EscrowTransaction` - Secure payments
- `Shipment` - Package tracking
- `ShipmentTracking` - Tracking events

### Live Commerce
- `LiveStream` - Live shopping sessions
- `LiveStreamProduct` - Products featured in streams
- `LiveStreamViewer` - Viewer tracking

### Analytics
- `PageView` - Page visit tracking
- `SearchQuery` - Search analytics
- `AnalyticsEvent` - Custom events

## Setup

### 1. Install Dependencies

```bash
cd packages/database
npm install
```

### 2. Configure Database

Copy `.env.example` to `.env` and configure your PostgreSQL connection:

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/publicadis?schema=public"
```

### 3. Run Migrations

```bash
npm run db:migrate
```

This will:
- Create all tables
- Set up indexes
- Configure PostgreSQL extensions (pgvector, pg_trgm, PostGIS)

### 4. Seed Database (Optional)

```bash
npm run db:seed
```

This creates:
- 2 tenants (Main + Demo MaaS)
- 4 test users
- 8 categories
- 4 subscription plans
- 2 demo businesses
- 2 demo listings
- Knowledge base entries

### 5. Open Prisma Studio (Optional)

```bash
npm run db:studio
```

Opens a visual database browser at http://localhost:5555

## Usage in Apps

### Import in Next.js (apps/web)

```typescript
import { prisma, type User, type Business } from '@publicadis/database';

// Query users
const users = await prisma.user.findMany({
  where: { tenantId: 'publicadis' },
  include: { ownedBusinesses: true },
});
```

### Import in NestJS (apps/api)

```typescript
import { Injectable } from '@nestjs/common';
import { prisma } from '@publicadis/database';

@Injectable()
export class UserService {
  async findAll() {
    return prisma.user.findMany();
  }
}
```

## Multi-Tenant Queries

Always filter by `tenantId` for multi-tenant isolation:

```typescript
// ❌ BAD - No tenant filtering
const listings = await prisma.listing.findMany();

// ✅ GOOD - Tenant-specific
const listings = await prisma.listing.findMany({
  where: { tenantId: currentTenant.id },
});
```

## Attribution System

Track user acquisition for revenue sharing:

```typescript
// When user signs up via a business page
const newUser = await prisma.user.create({
  data: {
    email: 'user@example.com',
    tenantId: 'publicadis',
    acquiredBy: businessOwnerId, // Who gets credit
    acquiredVia: 'page',          // How they were acquired
    acquiredFrom: businessId,     // Which page
  },
});
```

## Revenue Sharing

Automatic revenue distribution when transactions occur:

```typescript
const transaction = await prisma.transaction.create({
  data: {
    userId: user.id,
    amount: 100,
    type: 'SUBSCRIPTION',
    status: 'COMPLETED',
    revenueShares: {
      create: [
        {
          recipientType: 'PLATFORM',
          recipientId: tenantId,
          amount: 30,
          percentage: 30,
          status: 'PENDING',
        },
        {
          recipientType: 'SELLER',
          recipientId: businessOwnerId,
          amount: 70,
          percentage: 70,
          status: 'PENDING',
        },
      ],
    },
  },
});
```

## JSONB Metadata

Store category-specific data flexibly:

```typescript
// Jobs listing
await prisma.listing.create({
  data: {
    title: 'Senior Developer',
    categoryId: empleosCategory.id,
    metadata: {
      salary_min: 5000,
      salary_max: 7000,
      job_type: 'full_time',
      remote: true,
      benefits: ['health', 'vacation'],
    },
  },
});

// Real Estate listing
await prisma.listing.create({
  data: {
    title: 'Casa en venta',
    categoryId: inmueblesCategory.id,
    metadata: {
      property_type: 'house',
      bedrooms: 3,
      bathrooms: 2,
      area_sqm: 150,
      parking_spaces: 2,
    },
  },
});
```

## Vector Search (ADIS AI)

Store embeddings for semantic search:

```typescript
// Store knowledge with embedding
await prisma.businessKnowledgeBase.create({
  data: {
    businessId: business.id,
    question: '¿Cuál es el horario?',
    answer: 'Abierto de 9am a 6pm',
    // embedding will be generated by ADIS AI service
  },
});

// Search by similarity (raw SQL for pgvector)
const results = await prisma.$queryRaw`
  SELECT * FROM "BusinessKnowledgeBase"
  WHERE business_id = ${businessId}
  ORDER BY embedding <-> ${queryEmbedding}::vector
  LIMIT 5
`;
```

## Available Scripts

```bash
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema changes (dev)
npm run db:migrate       # Create and run migrations
npm run db:migrate:prod  # Run migrations in production
npm run db:seed          # Seed database with test data
npm run db:studio        # Open Prisma Studio
npm run db:reset         # Reset database (⚠️ deletes all data)
```

## PostgreSQL Extensions Required

The schema uses these PostgreSQL extensions:

- **pgvector** - Vector similarity search for ADIS AI
- **pg_trgm** - Fuzzy text search
- **PostGIS** - Geospatial queries

These are automatically configured in the schema. Make sure your PostgreSQL server supports them.

## Best Practices

1. **Always use transactions** for complex operations
2. **Filter by tenantId** for multi-tenant isolation
3. **Use JSONB metadata** for category-specific fields
4. **Track attribution** for revenue sharing
5. **Index frequently queried fields**
6. **Use Prisma Studio** for debugging
7. **Run migrations** before deployments

## Test Credentials (After Seed)

```
Admin:
  Email: admin@publicadis.com
  Password: admin123

Seller 1:
  Email: seller1@test.com
  Password: password123

Seller 2:
  Email: seller2@test.com
  Password: password123

Buyer:
  Email: buyer@test.com
  Password: password123
```

## Architecture Decisions

### Why Multi-Tenant?
- Enables MaaS (Marketplace as a Service)
- Partners can white-label the platform
- Single codebase, multiple marketplaces

### Why JSONB for Metadata?
- 8+ categories with different fields
- Flexibility without schema migrations
- Easy to add new categories

### Why pgvector?
- Semantic search for ADIS AI
- RAG (Retrieval Augmented Generation)
- Better than keyword search

### Why Attribution System?
- Track user acquisition source
- Automatic revenue sharing
- Incentivize growth

## Migrations

### Create Migration

```bash
npm run db:migrate -- --name add_new_feature
```

### Run Migrations in Production

```bash
npm run db:migrate:prod
```

## Troubleshooting

### Error: "Database does not exist"
```bash
# Create database manually
createdb publicadis
```

### Error: "Extension pgvector not found"
```bash
# Install pgvector extension (Ubuntu/Debian)
sudo apt install postgresql-15-pgvector

# Or use Docker with extensions
docker run -d \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=publicadis \
  -p 5432:5432 \
  ankane/pgvector
```

### Error: "Too many connections"
Use connection pooling:
```env
DATABASE_URL="postgresql://user:pass@host/db?connection_limit=5&pool_timeout=10"
```

## License

MIT
