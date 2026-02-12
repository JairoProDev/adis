# 🚀 Deployment Guide

Esta guía te ayudará a deployar PUBLICADIS en producción.

## 📋 Tabla de Contenidos

1. [Frontend Deployment](#frontend-deployment)
2. [Backend Deployment](#backend-deployment)
3. [Database Setup](#database-setup)
4. [Environment Variables](#environment-variables)
5. [CI/CD](#cicd)

---

## Frontend Deployment

### Vercel (Recomendado)

#### Pages App

1. **Conectar repositorio:**
   - Ve a [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Conecta tu repositorio de GitHub

2. **Configurar proyecto:**
   - **Root Directory:** `apps/pages`
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

3. **Variables de entorno:**
   ```
   NEXT_PUBLIC_API_URL=https://api.tu-dominio.com/graphql
   NODE_ENV=production
   ```

4. **Deploy:**
   - Vercel deploya automáticamente en cada push a `main`
   - O manualmente: `vercel --prod`

#### Marketplace App

Repite los mismos pasos pero con:
- **Root Directory:** `apps/marketplace`

---

## Backend Deployment

### Railway (Recomendado)

1. **Crear proyecto:**
   - Ve a [Railway](https://railway.app)
   - Click "New Project"
   - Selecciona "Deploy from GitHub repo"

2. **Configurar servicio:**
   - **Root Directory:** `apps/api`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm run start:prod`

3. **Agregar PostgreSQL:**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway crea automáticamente `DATABASE_URL`

4. **Variables de entorno:**
   ```
   NODE_ENV=production
   PORT=4000
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   REDIS_URL=redis://...
   JWT_SECRET=...
   ALLOWED_ORIGINS=https://tu-dominio.com
   FRONTEND_URL=https://tu-dominio.com
   # ... resto de variables
   ```

5. **Deploy:**
   - Railway deploya automáticamente en cada push

### Fly.io (Alternativa)

1. **Instalar Fly CLI:**
   ```bash
   npm i -g @fly/flyctl
   ```

2. **Login:**
   ```bash
   flyctl auth login
   ```

3. **Crear app:**
   ```bash
   cd apps/api
   flyctl launch
   ```

4. **Configurar secrets:**
   ```bash
   flyctl secrets set DATABASE_URL=...
   flyctl secrets set JWT_SECRET=...
   # ... resto de variables
   ```

5. **Deploy:**
   ```bash
   flyctl deploy
   ```

---

## Database Setup

### Neon (Recomendado)

1. **Crear cuenta:**
   - Ve a [Neon](https://neon.tech)
   - Crea un nuevo proyecto

2. **Configurar extensiones:**
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   CREATE EXTENSION IF NOT EXISTS pg_trgm;
   CREATE EXTENSION IF NOT EXISTS postgis;
   ```

3. **Obtener connection string:**
   - Copia la connection string desde el dashboard
   - Formato: `postgresql://user:password@host/db?sslmode=require`

4. **Ejecutar migraciones:**
   ```bash
   DATABASE_URL="tu-connection-string" npm run db:migrate:prod
   ```

### Supabase (Alternativa)

1. **Crear proyecto:**
   - Ve a [Supabase](https://supabase.com)
   - Crea un nuevo proyecto

2. **Habilitar extensiones:**
   - Ve a Database → Extensions
   - Habilita: `vector`, `pg_trgm`, `postgis`

3. **Obtener connection string:**
   - Ve a Settings → Database
   - Copia "Connection string" (URI)

4. **Ejecutar migraciones:**
   ```bash
   DATABASE_URL="tu-connection-string" npm run db:migrate:prod
   ```

---

## Environment Variables

### Production Variables Checklist

#### Backend (API)

```bash
# Core
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Security
JWT_SECRET=tu-secret-super-seguro
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=https://tu-dominio.com,https://www.tu-dominio.com

# Services
RESEND_API_KEY=re_...
EMAIL_FROM=Publicadis <noreply@tu-dominio.com>
GROQ_API_KEY=...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_ACCESS_KEY_ID=...
CLOUDFLARE_SECRET_ACCESS_KEY=...
CLOUDFLARE_BUCKET_NAME=publicadis-uploads-prod

# URLs
FRONTEND_URL=https://tu-dominio.com
API_URL=https://api.tu-dominio.com

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

#### Frontend (Next.js)

```bash
NEXT_PUBLIC_API_URL=https://api.tu-dominio.com/graphql
NODE_ENV=production
```

---

## CI/CD

### GitHub Actions

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build --filter=@publicadis/api
      # Add deployment steps here

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build --filter=@publicadis/pages
      - run: npm run build --filter=@publicadis/marketplace
      # Add deployment steps here
```

---

## Post-Deployment Checklist

- [ ] Verificar que todas las variables de entorno estén configuradas
- [ ] Ejecutar migraciones de base de datos
- [ ] Seedear datos iniciales (si es necesario)
- [ ] Verificar que GraphQL Playground funcione
- [ ] Verificar que los frontends se conecten al API
- [ ] Configurar dominio personalizado
- [ ] Configurar SSL/HTTPS
- [ ] Configurar monitoreo (Sentry, etc.)
- [ ] Configurar backups de base de datos
- [ ] Configurar webhooks de Stripe
- [ ] Probar flujo completo de autenticación
- [ ] Probar uploads de archivos
- [ ] Probar pagos (modo test primero)

---

## Monitoring

### Sentry (Error Tracking)

1. Crear cuenta en [Sentry](https://sentry.io)
2. Crear proyecto para Node.js y Next.js
3. Agregar DSN a variables de entorno
4. Instalar SDKs en código

### Better Stack (Logs)

1. Crear cuenta en [Better Stack](https://betterstack.com)
2. Crear source de logs
3. Configurar integración con Railway/Fly.io

---

## Scaling

### Database

- Usar connection pooling (PgBouncer)
- Configurar read replicas para queries pesadas
- Indexar queries frecuentes

### API

- Usar Redis para caching
- Implementar rate limiting
- Usar CDN para assets estáticos

### Frontend

- Usar Vercel Edge Network
- Optimizar imágenes con Next.js Image
- Implementar ISR para páginas estáticas

---

## Backup Strategy

1. **Database:**
   - Neon/Supabase tienen backups automáticos
   - Configurar backups diarios adicionales

2. **Files:**
   - Cloudflare R2 tiene versioning
   - Configurar replicación cross-region

3. **Code:**
   - GitHub tiene versionado completo
   - Tag releases importantes

---

## Security Checklist

- [ ] JWT_SECRET es único y seguro
- [ ] Todas las conexiones usan HTTPS
- [ ] CORS está configurado correctamente
- [ ] Rate limiting está activo
- [ ] Variables sensibles están en secrets
- [ ] Database tiene SSL habilitado
- [ ] Webhooks tienen verificación de firma
- [ ] Logs no contienen información sensible

---

## Support

Para ayuda con deployment:
- **Email:** jairo@publicadis.com
- **GitHub Issues:** [Crear issue](https://github.com/JairoProDev/adis/issues)

