# Publicadis Pages

> **Linktree killer for businesses** - Your complete digital presence

## Overview

Publicadis Pages is the "Trojan horse" growth strategy for Publicadis. It provides businesses with a free, professional landing page (similar to Linktree but more powerful) that serves as a gateway to the full Publicadis ecosystem.

### Why Publicadis Pages?

- **Free forever** - No cost to create a business page
- **Professional** - Better than Linktree for businesses
- **Growth engine** - Natural upgrade path to marketplace listings
- **Attribution built-in** - Tracks user acquisition for revenue sharing

## Features

### ✅ Core Features (MVP)

- 🎨 **Page Builder** - Visual editor for creating business pages
- 🔗 **Unlimited Links** - Add all your social media, products, services
- 📊 **Analytics** - Track visits, clicks, and conversions
- 🎭 **Themes** - Customizable colors, fonts, and layouts
- 📱 **Mobile-first** - Perfect on all devices
- 🔍 **SEO Optimized** - Appear in Google searches
- 💬 **WhatsApp Integration** - Direct contact button
- 📧 **Contact Forms** - Collect leads

### 🚀 Pro Features

- 🌐 **Custom Domain** - your-business.com instead of your-business.publicadis.com
- 📈 **Advanced Analytics** - Conversion tracking, heatmaps
- 🎯 **Call-to-Action Buttons** - Customizable CTAs
- 🏷️ **No Branding** - Remove "Powered by Publicadis"
- ☎️ **Phone Visible** - Show phone number with tracking
- 🎁 **10 Free Marketplace Listings** - Post jobs, services, etc.

### 💼 Business Features

- 🤖 **ADIS AI Assistant** - AI chatbot for your page
- 📦 **50 Marketplace Listings** - Full marketplace access
- 🔌 **API Access** - Integrate with your systems
- 👥 **Team Management** - Multiple users
- 📊 **White-label** - Full customization

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand + React Query
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Database**: Prisma (@publicadis/database)

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- PostgreSQL database running
- Environment variables configured

### Installation

```bash
# From monorepo root
npm install

# Generate database client
npm run db:generate
```

### Development

```bash
# Run pages app only
npm run dev --filter=@publicadis/pages

# Or from monorepo root
cd apps/pages
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Project Structure

```
apps/pages/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth routes (login, signup)
│   │   ├── (dashboard)/       # Dashboard routes
│   │   ├── [slug]/            # Dynamic business pages
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   │
│   ├── components/            # React components
│   │   ├── builder/          # Page builder components
│   │   ├── layout/           # Layout components
│   │   └── ui/               # shadcn/ui components
│   │
│   ├── lib/                  # Utilities
│   │   ├── auth.ts           # Auth helpers
│   │   ├── utils.ts          # General utilities
│   │   └── validations.ts    # Zod schemas
│   │
│   └── styles/
│       └── globals.css       # Global styles
│
├── public/                    # Static assets
├── next.config.js            # Next.js config
├── tailwind.config.ts        # Tailwind config
└── package.json
```

## Key Routes

### Public Routes

- `/` - Landing page
- `/[slug]` - Business page (e.g., /restaurante-el-buen-sabor)
- `/login` - Login
- `/signup` - Sign up

### Protected Routes (Dashboard)

- `/dashboard` - Dashboard home
- `/dashboard/page` - Edit your page
- `/dashboard/links` - Manage links
- `/dashboard/analytics` - View analytics
- `/dashboard/settings` - Account settings
- `/dashboard/upgrade` - Pricing & upgrades

## Attribution System

Every user who signs up through a business page is automatically attributed:

```typescript
const newUser = await prisma.user.create({
  data: {
    email: 'user@example.com',
    acquiredBy: businessOwnerId, // Attribution
    acquiredVia: 'page',
    acquiredFrom: businessId,
  },
});
```

This enables:
- Revenue sharing when attributed users upgrade
- Tracking which pages drive the most conversions
- Incentivizing page owners to promote their pages

## Growth Strategy

### Phase 1: Free Pages (Current)
- Offer unlimited free business pages
- No credit card required
- Get 10,000+ businesses on the platform

### Phase 2: Marketplace Upsell
- "Want to reach more customers? Post in our marketplace!"
- Free 3 listings, upgrade for more
- Natural conversion path

### Phase 3: Network Effects
- More pages → more SEO → more traffic → more signups
- Viral loop: businesses refer businesses
- Revenue sharing incentivizes growth

## Business Model

### Free Plan (S/0)
- Unlimited page
- Unlimited links
- Basic analytics
- Publicadis branding
- **Revenue**: None (acquisition channel)

### Pro Plan (S/49/mo)
- Everything in Free
- Custom domain
- No branding
- Advanced analytics
- 10 marketplace listings
- **Revenue**: S/49/mo - 30% platform fee

### Business Plan (S/149/mo)
- Everything in Pro
- 50 marketplace listings
- ADIS AI assistant
- API access
- **Revenue**: S/149/mo - 30% platform fee

## Key Metrics

### Acquisition Metrics
- Pages created/month
- User signups/month
- Attribution rate (% of users acquired via pages)

### Engagement Metrics
- Page views/page
- Click-through rate
- Time on page

### Conversion Metrics
- Free → Pro conversion rate
- Free → Business conversion rate
- Average time to first upgrade

### Revenue Metrics
- MRR (Monthly Recurring Revenue)
- ARPU (Average Revenue Per User)
- LTV/CAC ratio

## Development Guidelines

### Component Structure

```typescript
// components/BusinessCard.tsx
import { FC } from 'react';
import { cn } from '@/lib/utils';

interface BusinessCardProps {
  business: Business;
  className?: string;
}

export const BusinessCard: FC<BusinessCardProps> = ({ business, className }) => {
  return (
    <div className={cn('rounded-lg border p-4', className)}>
      <h3>{business.name}</h3>
    </div>
  );
};
```

### API Routes (Server Actions)

```typescript
// app/actions/business.ts
'use server';

import { prisma } from '@publicadis/database';
import { revalidatePath } from 'next/cache';

export async function updateBusiness(id: string, data: UpdateBusinessInput) {
  const business = await prisma.business.update({
    where: { id },
    data,
  });

  revalidatePath(`/${business.slug}`);
  return business;
}
```

### Form Validation

```typescript
// lib/validations/business.ts
import { z } from 'zod';

export const createBusinessSchema = z.object({
  name: z.string().min(3).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  tagline: z.string().max(200).optional(),
  description: z.string().max(5000).optional(),
});

export type CreateBusinessInput = z.infer<typeof createBusinessSchema>;
```

## Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Environment Variables in Vercel

Add these in Vercel dashboard:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- All other vars from `.env.example`

## Performance

- Lighthouse score: > 90
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Image optimization with Next.js Image
- Code splitting automatic
- SSR for SEO + ISR for dynamic pages

## SEO Strategy

Each business page is optimized for:
- Local search (city + service)
- Brand search (business name)
- Long-tail keywords (from description)

Example:
```html
<title>Restaurante El Buen Sabor - Cusco | Comida Tradicional Cusqueña</title>
<meta name="description" content="Restaurante tradicional cusqueño con más de 20 años de experiencia..." />
```

## License

MIT
