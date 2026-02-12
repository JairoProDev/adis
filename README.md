# 🚀 PUBLICADIS

**La infraestructura de clasificados de próxima generación para América Latina**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red)](https://nestjs.com/)

---

## 📖 Tabla de Contenidos

- [Visión](#visión)
- [Arquitectura](#arquitectura)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Guía de Desarrollo](#guía-de-desarrollo)
- [Convenciones de Código](#convenciones-de-código)
- [Roadmap](#roadmap)

---

## 🎯 Visión

Publicadis reemplaza a los periódicos tradicionales de clasificados con una plataforma digital de próxima generación que incluye:

- **Publicadis Pages**: Presencia digital completa para negocios (EaaS)
- **Publicadis Market**: Marketplace de clasificados con 8 categorías
- **Publicadis Ads**: Motor de publicidad democratizado con IA
- **ADIS AI**: Asistente conversacional inteligente

### El Problema

- Periódicos cobran S/15-140 por solo 3 días
- Sin fotos, sin métricas, sin seguimiento
- Audiencia decreciente
- Imposible de actualizar

### Nuestra Solución

- ✅ Anuncios digitales permanentes
- ✅ Fotos ilimitadas, analytics completos
- ✅ Precio competitivo (S/49/mes)
- ✅ IA conversacional (ADIS)
- ✅ Control total del lead flow

---

## 🏗️ Arquitectura

### Visión General

```
┌─────────────────────────────────────────┐
│           FRONTEND LAYER                │
│  ┌──────────┐  ┌──────────┐            │
│  │   Web    │  │  Admin   │            │
│  │ (Next.js)│  │Dashboard │            │
│  └──────────┘  └──────────┘            │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│         BACKEND LAYER                   │
│  ┌─────────────────────────────┐       │
│  │      API (NestJS)           │       │
│  │  ┌────────┐  ┌────────┐    │       │
│  │  │  Auth  │  │  Users │    │       │
│  │  └────────┘  └────────┘    │       │
│  │  ┌────────┐  ┌────────┐    │       │
│  │  │Listings│  │  ADIS  │    │       │
│  │  └────────┘  └────────┘    │       │
│  └─────────────────────────────┘       │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│          DATA LAYER                     │
│  ┌────────────┐    ┌──────────┐        │
│  │ PostgreSQL │    │  Redis   │        │
│  │  +pgvector │    │  (cache) │        │
│  └────────────┘    └──────────┘        │
└─────────────────────────────────────────┘
```

### Decisiones de Arquitectura Clave

**Monolito Modular (Fase 1):**
- Más rápido de iterar que microservicios
- NestJS con módulos bien separados
- Migraremos a microservicios cuando sea necesario

**PostgreSQL como Primary DB:**
- Con extensiones: pgvector, pg_trgm, PostGIS
- Full-text search nativo
- Geolocation integrada

**Redis:**
- Cache de queries frecuentes
- Queue para jobs (BullMQ)
- Real-time pub/sub (Socket.io)

---

## 🛠️ Stack Tecnológico

### Frontend

- **Framework**: Next.js 14+ (App Router)
- **UI**: React 18 + TypeScript
- **Styling**: Tailwind CSS 3+
- **Components**: shadcn/ui
- **State**: Zustand + React Query
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion

### Backend

- **Framework**: NestJS 10+
- **Language**: TypeScript (strict mode)
- **ORM**: Prisma
- **Validation**: class-validator + Zod
- **Auth**: Passport.js + JWT
- **Queue**: BullMQ (Redis)
- **WebSocket**: Socket.io

### Database

- **Primary**: PostgreSQL 15+
  - Extensions: pgvector, pg_trgm, PostGIS
- **Cache**: Redis 7+
- **Object Storage**: AWS S3 / Cloudflare R2

### AI/ML

- **LLM**: Groq API (Llama 3)
- **Framework**: LangChain.js
- **Embeddings**: Sentence Transformers (bge-small)
- **Vector DB**: pgvector

### DevOps

- **Hosting**: Vercel (frontend), Railway/Fly.io (backend)
- **Database**: Neon / Supabase
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry, Better Stack
- **CDN**: Cloudflare

### Payments

- **International**: Stripe
- **LATAM**: Mercado Pago
- **Peru**: Niubiz, Culqi

---

## 📁 Estructura del Proyecto

```
publicadis/
├── apps/
│   ├── web/                 # Next.js app (frontend principal)
│   ├── api/                 # NestJS app (backend API)
│   └── admin/               # Next.js app (admin dashboard)
│
├── packages/
│   ├── ui/                  # Componentes React compartidos
│   ├── database/            # Prisma schema + migrations
│   ├── typescript-config/   # Configuraciones TypeScript
│   ├── eslint-config/       # Configuraciones ESLint
│   └── config/              # Configs compartidas
│
├── docs/                    # Documentación
│   ├── MASTER_FEATURE_LIST.md
│   ├── DEVELOPMENT_PLAN_100_STEPS.md
│   └── API.md
│
├── .github/                 # GitHub Actions workflows
├── turbo.json               # Configuración Turbo
├── package.json             # Root package
└── README.md               # Este archivo
```

### Workspaces

El proyecto usa **npm workspaces** con **Turbo** para gestión eficiente del monorepo.

#### Aplicaciones (apps/)

- **web**: Landing page + Marketplace público
- **api**: Backend REST API
- **admin**: Dashboard administrativo

#### Paquetes Compartidos (packages/)

- **ui**: Design system (componentes React reutilizables)
- **database**: Esquema Prisma, migraciones, seed data
- **typescript-config**: Configuraciones TS por tipo de proyecto
- **eslint-config**: Reglas de linting compartidas
- **config**: Configuraciones compartidas (env, constants)

---

## 🚀 Guía de Desarrollo

### Prerequisitos

- **Node.js** >= 20.0.0
- **npm** >= 10.0.0
- **Docker** & Docker Compose (recomendado para PostgreSQL y Redis)
- **Git**

### Setup Rápido (Recomendado)

Usa nuestro script de setup automatizado:

**Linux/macOS:**
```bash
git clone https://github.com/JairoProDev/adis.git
cd adis
chmod +x scripts/setup.sh
./scripts/setup.sh
```

**Windows (PowerShell):**
```powershell
git clone https://github.com/JairoProDev/adis.git
cd adis
.\scripts\setup.ps1
```

El script automáticamente:
- ✅ Verifica versiones de Node.js y npm
- ✅ Instala todas las dependencias
- ✅ Inicia PostgreSQL y Redis con Docker
- ✅ Genera el Prisma Client
- ✅ Crea archivos `.env.local` con valores por defecto
- ✅ Ejecuta migraciones de base de datos
- ✅ Opcionalmente seedea la base de datos

### Setup Manual

Si prefieres hacerlo manualmente:

1. **Clonar el repositorio:**

```bash
git clone https://github.com/JairoProDev/adis.git
cd adis
```

2. **Instalar dependencias:**

```bash
npm install
```

3. **Iniciar servicios con Docker:**

```bash
# Inicia PostgreSQL y Redis
docker-compose up -d

# Verifica que estén corriendo
docker ps
```

**Alternativa sin Docker:** Necesitarás instalar PostgreSQL 15+ con extensiones (pgvector, pg_trgm, PostGIS) y Redis 7+ manualmente.

4. **Configurar variables de entorno:**

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# .env.local
NODE_ENV=development

# Database (con Docker)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/publicadis?schema=public

# Redis (con Docker)
REDIS_URL=redis://localhost:6379

# API
PORT=4000
API_URL=http://localhost:4000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# JWT (genera uno seguro: openssl rand -base64 32)
JWT_SECRET=tu-secret-key-aqui
JWT_EXPIRES_IN=7d

# Servicios opcionales (puedes agregarlos después)
RESEND_API_KEY=
GROQ_API_KEY=
STRIPE_SECRET_KEY=
CLOUDFLARE_ACCOUNT_ID=
```

Crea también `.env.local` en cada app frontend:

**apps/marketplace/.env.local:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
```

**apps/pages/.env.local:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
```

5. **Setup de base de datos:**

```bash
# Generar Prisma client
npm run db:generate

# Aplicar migraciones (crea las tablas)
npm run db:push

# Seed data con datos de prueba (opcional)
npm run db:seed
```

6. **Iniciar en desarrollo:**

```bash
# Todos los apps en paralelo (recomendado)
npm run dev

# Esto iniciará:
# - API en http://localhost:4000
# - Pages App en http://localhost:3000
# - Marketplace App en http://localhost:3001
```

**O iniciar individualmente:**

```bash
# Solo API
npm run dev --filter=@publicadis/api

# Solo Pages App
npm run dev --filter=@publicadis/pages

# Solo Marketplace App
npm run dev --filter=@publicadis/marketplace
```

### Verificar que todo funciona

1. **API:** Abre http://localhost:4000/graphql (GraphQL Playground)
2. **Pages App:** http://localhost:3000
3. **Marketplace App:** http://localhost:3001
4. **Prisma Studio:** `npm run db:studio` (abre en http://localhost:5555)

### Credenciales de Prueba (si ejecutaste seed)

- **Admin:** `admin@publicadis.com` / `admin123`
- **Seller 1:** `seller1@test.com` / `password123`
- **Seller 2:** `seller2@test.com` / `password123`
- **Buyer:** `buyer@test.com` / `password123`

### Scripts Disponibles

```bash
# Desarrollo
npm run dev                          # Todos los apps en paralelo
npm run dev --filter=@publicadis/api # Solo API
npm run dev --filter=@publicadis/pages # Solo Pages App
npm run dev --filter=@publicadis/marketplace # Solo Marketplace

# Build
npm run build                        # Build all apps
npm run build --filter=@publicadis/api

# Testing
npm run test                         # Tests de todos
npm run test:watch                   # Watch mode

# Linting
npm run lint                         # Lint all
npm run format                       # Prettier format
npm run typecheck                    # TypeScript type checking

# Database
npm run db:generate                  # Generar Prisma client
npm run db:push                      # Aplicar schema (desarrollo)
npm run db:migrate                   # Crear migración
npm run db:migrate:prod              # Aplicar migraciones (producción)
npm run db:seed                      # Seed data con datos de prueba
npm run db:studio                    # Abrir Prisma Studio (http://localhost:5555)
npm run db:reset                     # Resetear base de datos (⚠️ borra todo)

# Docker
docker-compose up -d                 # Iniciar PostgreSQL y Redis
docker-compose down                  # Detener servicios
docker-compose logs -f               # Ver logs

# Clean
npm run clean                        # Limpiar build artifacts y node_modules
```

### Servicios y Puertos

| Servicio | Puerto | URL |
|----------|--------|-----|
| API (NestJS) | 4000 | http://localhost:4000 |
| GraphQL Playground | 4000 | http://localhost:4000/graphql |
| Pages App (Next.js) | 3000 | http://localhost:3000 |
| Marketplace App (Next.js) | 3001 | http://localhost:3001 |
| PostgreSQL | 5432 | localhost:5432 |
| Redis | 6379 | localhost:6379 |
| Prisma Studio | 5555 | http://localhost:5555 |

---

## 📐 Convenciones de Código

### TypeScript

- **Modo estricto activado**
- Evitar `any`, usar tipos específicos
- Usar interfaces para objetos, types para uniones
- Nombrar interfaces sin prefijo `I`

```typescript
// ✅ Correcto
interface User {
  id: string;
  name: string;
}

type UserRole = 'admin' | 'user' | 'seller';

// ❌ Incorrecto
interface IUser {
  // ...
}
```

### Naming Conventions

- **Archivos**: kebab-case (`user-service.ts`)
- **Componentes React**: PascalCase (`UserCard.tsx`)
- **Funciones/variables**: camelCase (`getUserById`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Interfaces/Types**: PascalCase (`UserProfile`)

### Estructura de Componentes React

```tsx
// UserCard.tsx
import { FC } from 'react';
import { cn } from '@/lib/utils';

interface UserCardProps {
  user: User;
  onClick?: () => void;
  className?: string;
}

export const UserCard: FC<UserCardProps> = ({ user, onClick, className }) => {
  return (
    <div className={cn('rounded-lg border p-4', className)} onClick={onClick}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
};
```

### API Routes (NestJS)

```typescript
// user.controller.ts
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(@Query() query: FindUsersDto) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
```

### Git Workflow

**Branches:**

- `main`: Production
- `develop`: Development
- `feature/[nombre]`: Features
- `fix/[nombre]`: Bugfixes
- `hotfix/[nombre]`: Production hotfixes

**Commits:**

Usar [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add user authentication
fix: resolve login redirect issue
docs: update README with setup instructions
chore: upgrade dependencies
refactor: simplify user service logic
test: add tests for auth module
```

**Pull Requests:**

- Hacer PR a `develop`
- Mínimo 1 aprobación
- Tests deben pasar
- Sin conflictos

---

## 🗺️ Roadmap

### ✅ Fase 0: Setup (Semana 1) - EN PROGRESO

- [x] Configurar monorepo
- [x] Setup TypeScript, ESLint, Prettier
- [ ] Configurar Prisma
- [ ] Setup Next.js app
- [ ] Setup NestJS app
- [ ] CI/CD básico

### 🚧 Fase 1: MVP Core (Semana 2-4)

- [ ] Authentication completo
- [ ] User management
- [ ] Landing page
- [ ] Búsqueda global
- [ ] Publicadis Pages (builder básico)

### 📋 Fase 2: Publicadis Market - Empleos (Semana 5-6)

- [ ] Publicación de empleos
- [ ] Browse & detalle
- [ ] Sistema de aplicación
- [ ] ATS básico

### 📋 Fase 3: Servicios & Contacto (Semana 7-8)

- [ ] Categoría Servicios
- [ ] Sistema de reservas
- [ ] Chat in-app (real-time)
- [ ] Contact tracking

### 💰 Fase 4: Reviews & Monetización (Semana 9-10)

- [ ] Sistema de reviews
- [ ] Stripe integration
- [ ] Planes de suscripción
- [ ] Billing dashboard

### 🤖 Fase 5: ADIS AI v0.1 (Semana 11-12)

- [ ] RAG pipeline
- [ ] LLM integration (Groq)
- [ ] Chat widget UI
- [ ] Búsqueda conversacional

### 🎯 MVP Lanzable: Semana 13

**Ver plan completo**: [DEVELOPMENT_PLAN_100_STEPS.md](./DEVELOPMENT_PLAN_100_STEPS.md)

---

## 📞 Contacto

- **Email**: jairo@publicadis.com
- **GitHub**: [@JairoProDev](https://github.com/JairoProDev)
- **Website**: [publicadis.com](https://publicadis.com) (próximamente)

---

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE) para detalles

---

## 🙏 Agradecimientos

Construido con ❤️ en Perú para América Latina

**Stack tecnológico powered by:**

- [Next.js](https://nextjs.org/)
- [NestJS](https://nestjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Groq](https://groq.com/)
- [Vercel](https://vercel.com/)

---

⭐ Si te gusta el proyecto, dale una estrella en GitHub!
