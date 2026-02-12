# 🚀 PUBLICADIS - Guía de Setup Completa

Esta guía te ayudará a configurar el proyecto desde cero para desarrollo local y deployment.

## 📋 Tabla de Contenidos

1. [Prerequisitos](#prerequisitos)
2. [Setup Rápido](#setup-rápido)
3. [Setup Manual](#setup-manual)
4. [Configuración de Servicios](#configuración-de-servicios)
5. [Variables de Entorno](#variables-de-entorno)
6. [Base de Datos](#base-de-datos)
7. [Deployment](#deployment)
8. [Solución de Problemas](#solución-de-problemas)

---

## Prerequisitos

### Requeridos

- **Node.js** >= 20.0.0 ([Descargar](https://nodejs.org/))
- **npm** >= 10.0.0 (viene con Node.js)
- **Docker Desktop** ([Descargar](https://www.docker.com/products/docker-desktop))
- **Git** ([Descargar](https://git-scm.com/))

### Opcionales (para producción)

- Cuenta en **Resend** (para emails)
- Cuenta en **Groq** (para AI)
- Cuenta en **Stripe** (para pagos)
- Cuenta en **Cloudflare R2** (para uploads)

---

## Setup Rápido

### Linux/macOS

```bash
# 1. Clonar repositorio
git clone https://github.com/JairoProDev/adis.git
cd adis

# 2. Ejecutar script de setup
chmod +x scripts/setup.sh
./scripts/setup.sh

# 3. Iniciar desarrollo
npm run dev
```

### Windows (PowerShell)

```powershell
# 1. Clonar repositorio
git clone https://github.com/JairoProDev/adis.git
cd adis

# 2. Ejecutar script de setup
.\scripts\setup.ps1

# 3. Iniciar desarrollo
npm run dev
```

El script automáticamente:
- ✅ Verifica versiones
- ✅ Instala dependencias
- ✅ Inicia Docker (PostgreSQL + Redis)
- ✅ Genera Prisma Client
- ✅ Crea archivos `.env.local`
- ✅ Ejecuta migraciones
- ✅ Opcionalmente seedea la base de datos

---

## Setup Manual

### 1. Clonar Repositorio

```bash
git clone https://github.com/JairoProDev/adis.git
cd adis
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Iniciar Servicios con Docker

```bash
# Iniciar PostgreSQL y Redis
docker-compose up -d

# Verificar que estén corriendo
docker ps

# Ver logs si es necesario
docker-compose logs -f
```

**Nota:** Si no usas Docker, necesitarás instalar PostgreSQL 15+ con extensiones (pgvector, pg_trgm, PostGIS) y Redis 7+ manualmente.

### 4. Configurar Variables de Entorno

#### Root `.env.local`

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Node Environment
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/publicadis?schema=public

# Redis
REDIS_URL=redis://localhost:6379

# API Configuration
PORT=4000
API_URL=http://localhost:4000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# JWT Authentication
# Genera uno seguro: openssl rand -base64 32
JWT_SECRET=tu-secret-key-muy-seguro-aqui
JWT_EXPIRES_IN=7d

# Email (Opcional - Get from https://resend.com)
RESEND_API_KEY=
EMAIL_FROM=Publicadis <noreply@publicadis.com>

# File Uploads (Opcional - Get from Cloudflare R2)
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_ACCESS_KEY_ID=
CLOUDFLARE_SECRET_ACCESS_KEY=
CLOUDFLARE_BUCKET_NAME=publicadis-uploads

# Payments (Opcional - Get from https://dashboard.stripe.com)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
FRONTEND_URL=http://localhost:3000

# AI (Opcional - Get from https://console.groq.com)
GROQ_API_KEY=

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

#### Frontend Apps

**apps/marketplace/.env.local:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
```

**apps/pages/.env.local:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
```

### 5. Setup Base de Datos

```bash
# Generar Prisma Client
npm run db:generate

# Aplicar schema a la base de datos
npm run db:push

# (Opcional) Seedear con datos de prueba
npm run db:seed
```

### 6. Iniciar Desarrollo

```bash
# Todos los apps en paralelo
npm run dev
```

Esto iniciará:
- **API:** http://localhost:4000
- **GraphQL Playground:** http://localhost:4000/graphql
- **Pages App:** http://localhost:3000
- **Marketplace App:** http://localhost:3001

---

## Configuración de Servicios

### Resend (Email)

1. Crear cuenta en [Resend](https://resend.com)
2. Obtener API Key desde el dashboard
3. Agregar a `.env.local`: `RESEND_API_KEY=re_...`

### Groq (AI)

1. Crear cuenta en [Groq Console](https://console.groq.com)
2. Crear API Key
3. Agregar a `.env.local`: `GROQ_API_KEY=...`

### Stripe (Pagos)

1. Crear cuenta en [Stripe](https://stripe.com)
2. Obtener API keys desde [Dashboard](https://dashboard.stripe.com/apikeys)
3. Agregar a `.env.local`:
   - `STRIPE_SECRET_KEY=sk_test_...`
   - `STRIPE_PUBLISHABLE_KEY=pk_test_...`
   - `STRIPE_WEBHOOK_SECRET=whsec_...` (después de crear webhook)

### Cloudflare R2 (File Uploads)

1. Crear cuenta en [Cloudflare](https://cloudflare.com)
2. Crear bucket R2 desde dashboard
3. Crear API Token con permisos R2
4. Agregar a `.env.local`:
   - `CLOUDFLARE_ACCOUNT_ID=...`
   - `CLOUDFLARE_ACCESS_KEY_ID=...`
   - `CLOUDFLARE_SECRET_ACCESS_KEY=...`
   - `CLOUDFLARE_BUCKET_NAME=publicadis-uploads`

---

## Base de Datos

### Comandos Útiles

```bash
# Generar Prisma Client (después de cambios en schema)
npm run db:generate

# Aplicar cambios al schema (desarrollo)
npm run db:push

# Crear migración (producción)
npm run db:migrate

# Aplicar migraciones (producción)
npm run db:migrate:prod

# Seedear base de datos
npm run db:seed

# Abrir Prisma Studio (GUI para base de datos)
npm run db:studio

# Resetear base de datos (⚠️ borra todo)
npm run db:reset
```

### Prisma Studio

Abre una interfaz gráfica para explorar y editar datos:

```bash
npm run db:studio
```

Abre en: http://localhost:5555

### Estructura de Base de Datos

El proyecto usa PostgreSQL con las siguientes extensiones:
- **pgvector**: Para búsqueda semántica (AI)
- **pg_trgm**: Para búsqueda de texto
- **PostGIS**: Para geolocalización

---

## Deployment

### Frontend (Vercel)

1. Conectar repositorio a Vercel
2. Configurar variables de entorno:
   - `NEXT_PUBLIC_API_URL=https://tu-api.com/graphql`
3. Deploy automático en cada push a `main`

### Backend (Railway/Fly.io)

#### Railway

1. Crear proyecto en [Railway](https://railway.app)
2. Conectar repositorio
3. Agregar servicio PostgreSQL
4. Configurar variables de entorno
5. Deploy automático

#### Fly.io

1. Instalar Fly CLI: `npm i -g @fly/flyctl`
2. Login: `flyctl auth login`
3. Crear app: `flyctl launch`
4. Configurar variables: `flyctl secrets set KEY=value`
5. Deploy: `flyctl deploy`

### Base de Datos (Neon/Supabase)

#### Neon

1. Crear cuenta en [Neon](https://neon.tech)
2. Crear proyecto
3. Copiar connection string
4. Agregar a variables de entorno: `DATABASE_URL=...`

#### Supabase

1. Crear cuenta en [Supabase](https://supabase.com)
2. Crear proyecto
3. Habilitar extensiones: pgvector, pg_trgm, PostGIS
4. Copiar connection string
5. Agregar a variables de entorno: `DATABASE_URL=...`

### Variables de Entorno para Producción

```bash
NODE_ENV=production
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
ALLOWED_ORIGINS=https://tu-dominio.com
FRONTEND_URL=https://tu-dominio.com
# ... resto de variables
```

---

## Solución de Problemas

### Error: "Cannot connect to database"

**Solución:**
1. Verificar que Docker esté corriendo: `docker ps`
2. Verificar que PostgreSQL esté corriendo: `docker-compose ps`
3. Verificar `DATABASE_URL` en `.env.local`
4. Reiniciar contenedores: `docker-compose restart`

### Error: "Prisma Client not generated"

**Solución:**
```bash
npm run db:generate
```

### Error: "Port already in use"

**Solución:**
- Cambiar puerto en `.env.local`: `PORT=4001`
- O matar proceso: `lsof -ti:4000 | xargs kill`

### Error: "Module not found"

**Solución:**
```bash
# Limpiar e instalar de nuevo
rm -rf node_modules
npm install
```

### PostgreSQL extensions not found

**Solución:**
Si usas Docker, el image `pgvector/pgvector:pg16` ya incluye las extensiones.

Si instalas PostgreSQL manualmente:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS postgis;
```

### Redis connection error

**Solución:**
1. Verificar que Redis esté corriendo: `docker ps`
2. Verificar `REDIS_URL` en `.env.local`
3. Reiniciar: `docker-compose restart redis`

---

## Recursos Adicionales

- [Documentación NestJS](https://docs.nestjs.com)
- [Documentación Next.js](https://nextjs.org/docs)
- [Documentación Prisma](https://www.prisma.io/docs)
- [Documentación GraphQL](https://graphql.org/learn)
- [Documentación Docker](https://docs.docker.com)

---

## Soporte

Si tienes problemas, crea un issue en GitHub o contacta:
- **Email:** jairo@publicadis.com
- **GitHub:** [@JairoProDev](https://github.com/JairoProDev)

