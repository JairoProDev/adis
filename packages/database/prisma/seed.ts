/**
 * Database seeder for PUBLICADIS
 * Creates initial data for all features
 */

import { PrismaClient, UserRole, BusinessPlan, BusinessStatus } from '@prisma/client';
import { hashPassword } from '../utils/auth';
import { generateSlug } from '../utils/slug';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // ============================================================================
  // 1. CREATE MAIN TENANT (Publicadis Platform)
  // ============================================================================
  console.log('📦 Creating main tenant...');
  const mainTenant = await prisma.tenant.upsert({
    where: { slug: 'publicadis' },
    update: {},
    create: {
      slug: 'publicadis',
      name: 'Publicadis',
      domain: 'publicadis.com',
      status: 'ACTIVE',
      revenueSharePercentage: 30.0,
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      config: {
        features: {
          pages: true,
          market: true,
          ads: true,
          adisAI: true,
        },
      },
    },
  });
  console.log(`✅ Main tenant created: ${mainTenant.name}\n`);

  // ============================================================================
  // 2. CREATE DEMO MaaS TENANT
  // ============================================================================
  console.log('📦 Creating demo MaaS tenant...');
  const demoTenant = await prisma.tenant.upsert({
    where: { slug: 'demo-marketplace' },
    update: {},
    create: {
      slug: 'demo-marketplace',
      name: 'Demo Marketplace',
      status: 'ACTIVE',
      revenueSharePercentage: 20.0, // Better deal for partners
      config: {
        features: {
          pages: true,
          market: true,
          ads: false, // Limited features
          adisAI: true,
        },
      },
    },
  });
  console.log(`✅ Demo MaaS tenant created: ${demoTenant.name}\n`);

  // ============================================================================
  // 3. CREATE ADMIN USER
  // ============================================================================
  console.log('👤 Creating admin user...');
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@publicadis.com' },
    update: {},
    create: {
      email: 'admin@publicadis.com',
      passwordHash: adminPassword,
      emailVerified: new Date(),
      firstName: 'Admin',
      lastName: 'Publicadis',
      role: 'SUPER_ADMIN',
      tenantId: mainTenant.id,
    },
  });
  console.log(`✅ Admin user created: ${admin.email}\n`);

  // ============================================================================
  // 4. CREATE TEST USERS
  // ============================================================================
  console.log('👥 Creating test users...');
  const userPassword = await hashPassword('password123');

  const seller1 = await prisma.user.upsert({
    where: { email: 'seller1@test.com' },
    update: {},
    create: {
      email: 'seller1@test.com',
      passwordHash: userPassword,
      emailVerified: new Date(),
      firstName: 'María',
      lastName: 'González',
      role: 'SELLER',
      tenantId: mainTenant.id,
    },
  });

  const seller2 = await prisma.user.upsert({
    where: { email: 'seller2@test.com' },
    update: {},
    create: {
      email: 'seller2@test.com',
      passwordHash: userPassword,
      emailVerified: new Date(),
      firstName: 'Carlos',
      lastName: 'Rodríguez',
      role: 'SELLER',
      tenantId: mainTenant.id,
      // This user was acquired by seller1 (referral)
      acquiredBy: seller1.id,
      acquiredVia: 'referral',
    },
  });

  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@test.com' },
    update: {},
    create: {
      email: 'buyer@test.com',
      passwordHash: userPassword,
      emailVerified: new Date(),
      firstName: 'Ana',
      lastName: 'Martínez',
      role: 'USER',
      tenantId: mainTenant.id,
    },
  });

  console.log(`✅ Created ${3} test users\n`);

  // ============================================================================
  // 5. CREATE CATEGORIES (All 8 verticals)
  // ============================================================================
  console.log('📂 Creating categories...');

  const categories = [
    {
      slug: 'empleos',
      name: 'Empleos',
      description: 'Encuentra tu próximo trabajo o publica ofertas laborales',
      icon: '💼',
      order: 1,
      fieldsSchema: {
        fields: [
          'salary_min',
          'salary_max',
          'job_type',
          'experience_required',
          'education_required',
        ],
      },
    },
    {
      slug: 'servicios',
      name: 'Servicios',
      description: 'Ofrece o contrata servicios profesionales',
      icon: '🛠️',
      order: 2,
      fieldsSchema: {
        fields: ['service_type', 'hourly_rate', 'availability', 'coverage_area'],
      },
    },
    {
      slug: 'inmuebles',
      name: 'Inmuebles',
      description: 'Compra, vende o alquila propiedades',
      icon: '🏠',
      order: 3,
      fieldsSchema: {
        fields: [
          'property_type',
          'bedrooms',
          'bathrooms',
          'area_sqm',
          'operation_type',
        ],
      },
    },
    {
      slug: 'vehiculos',
      name: 'Vehículos',
      description: 'Encuentra o vende vehículos',
      icon: '🚗',
      order: 4,
      fieldsSchema: {
        fields: ['make', 'model', 'year', 'mileage', 'fuel_type', 'transmission'],
      },
    },
    {
      slug: 'productos',
      name: 'Productos',
      description: 'Compra y vende todo tipo de productos',
      icon: '📦',
      order: 5,
      fieldsSchema: {
        fields: ['condition', 'brand', 'warranty', 'shipping_available'],
      },
    },
    {
      slug: 'eventos',
      name: 'Eventos',
      description: 'Descubre y promociona eventos',
      icon: '🎉',
      order: 6,
      fieldsSchema: {
        fields: ['event_date', 'event_time', 'venue', 'capacity', 'ticket_price'],
      },
    },
    {
      slug: 'negocios',
      name: 'Negocios en Venta',
      description: 'Compra o vende negocios establecidos',
      icon: '🏢',
      order: 7,
      fieldsSchema: {
        fields: ['business_type', 'annual_revenue', 'employees', 'established_year'],
      },
    },
    {
      slug: 'comunidad',
      name: 'Comunidad',
      description: 'Conecta con tu comunidad local',
      icon: '👥',
      order: 8,
      fieldsSchema: {
        fields: ['community_type', 'members_count', 'meeting_frequency'],
      },
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log(`✅ Created ${categories.length} categories\n`);

  // ============================================================================
  // 6. CREATE SUBSCRIPTION PLANS
  // ============================================================================
  console.log('💳 Creating subscription plans...');

  const plans = [
    {
      slug: 'free',
      name: 'Gratis',
      description: 'Ideal para empezar con tu página de negocio',
      price: 0,
      currency: 'PEN',
      interval: 'MONTHLY' as const,
      features: {
        pages: true,
        listings: 3,
        featuredListings: 0,
        analytics: false,
        phoneVisible: false,
        prioritySupport: false,
      },
      listingsLimit: 3,
      featuredListingsLimit: 0,
    },
    {
      slug: 'pro',
      name: 'Pro',
      description: 'Para negocios que buscan crecer',
      price: 49,
      currency: 'PEN',
      interval: 'MONTHLY' as const,
      features: {
        pages: true,
        listings: 10,
        featuredListings: 2,
        analytics: true,
        phoneVisible: true,
        prioritySupport: false,
        adCredits: 50,
      },
      listingsLimit: 10,
      featuredListingsLimit: 2,
    },
    {
      slug: 'business',
      name: 'Business',
      description: 'Para empresas establecidas',
      price: 149,
      currency: 'PEN',
      interval: 'MONTHLY' as const,
      features: {
        pages: true,
        listings: 50,
        featuredListings: 10,
        analytics: true,
        phoneVisible: true,
        prioritySupport: true,
        adCredits: 200,
        customDomain: true,
        adisAI: true,
      },
      listingsLimit: 50,
      featuredListingsLimit: 10,
    },
    {
      slug: 'enterprise',
      name: 'Enterprise',
      description: 'Soluciones personalizadas para grandes empresas',
      price: 499,
      currency: 'PEN',
      interval: 'MONTHLY' as const,
      features: {
        pages: true,
        listings: -1, // unlimited
        featuredListings: -1,
        analytics: true,
        phoneVisible: true,
        prioritySupport: true,
        adCredits: 1000,
        customDomain: true,
        adisAI: true,
        api: true,
        whiteLabel: true,
      },
      listingsLimit: null,
      featuredListingsLimit: null,
    },
  ];

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { slug: plan.slug },
      update: {},
      create: plan,
    });
  }

  console.log(`✅ Created ${plans.length} subscription plans\n`);

  // ============================================================================
  // 7. CREATE DEMO BUSINESSES (Publicadis Pages)
  // ============================================================================
  console.log('🏪 Creating demo businesses...');

  const business1 = await prisma.business.create({
    data: {
      slug: generateSlug('Restaurante El Buen Sabor'),
      name: 'Restaurante El Buen Sabor',
      tagline: 'Sabores auténticos de Cusco',
      description:
        'Restaurante tradicional cusqueño con más de 20 años de experiencia. Ofrecemos platos típicos preparados con ingredientes frescos de la región.',
      email: 'contacto@elbuensabor.com',
      phone: '+51 984 123 456',
      whatsapp: '+51 984 123 456',
      city: 'Cusco',
      country: 'PE',
      tenantId: mainTenant.id,
      ownerId: seller1.id,
      status: 'ACTIVE' as BusinessStatus,
      plan: 'PRO' as BusinessPlan,
      verified: true,
    },
  });

  const business2 = await prisma.business.create({
    data: {
      slug: generateSlug('Tech Solutions Peru'),
      name: 'Tech Solutions Peru',
      tagline: 'Transformación digital para tu negocio',
      description:
        'Desarrollamos soluciones tecnológicas a medida para empresas de todos los tamaños. Especialistas en e-commerce, apps móviles y sistemas web.',
      email: 'info@techsolutions.pe',
      phone: '+51 987 654 321',
      city: 'Lima',
      country: 'PE',
      tenantId: mainTenant.id,
      ownerId: seller2.id,
      status: 'ACTIVE' as BusinessStatus,
      plan: 'BUSINESS' as BusinessPlan,
      verified: true,
      // This business was acquired via seller1's page (attribution)
    },
  });

  console.log(`✅ Created ${2} demo businesses\n`);

  // ============================================================================
  // 8. CREATE DEMO LISTINGS
  // ============================================================================
  console.log('📝 Creating demo listings...');

  const empleosCategory = await prisma.category.findUnique({
    where: { slug: 'empleos' },
  });
  const serviciosCategory = await prisma.category.findUnique({
    where: { slug: 'servicios' },
  });

  if (empleosCategory) {
    await prisma.listing.create({
      data: {
        slug: generateSlug('Desarrollador Full Stack Senior'),
        title: 'Desarrollador Full Stack Senior',
        description:
          'Buscamos desarrollador con experiencia en React, Node.js y PostgreSQL. Trabajo remoto con equipo internacional. Excelentes beneficios.',
        categoryId: empleosCategory.id,
        businessId: business2.id,
        tenantId: mainTenant.id,
        userId: seller2.id,
        price: 5000,
        priceType: 'MONTHLY',
        currency: 'PEN',
        city: 'Lima',
        country: 'PE',
        status: 'ACTIVE',
        metadata: {
          salary_min: 5000,
          salary_max: 7000,
          job_type: 'full_time',
          experience_required: '5+ años',
          education_required: 'Universitario',
          remote: true,
          benefits: ['Seguro de salud', 'Bono anual', 'Vacaciones 30 días'],
        },
        publishedAt: new Date(),
      },
    });
  }

  if (serviciosCategory) {
    await prisma.listing.create({
      data: {
        slug: generateSlug('Diseño de Páginas Web Profesionales'),
        title: 'Diseño de Páginas Web Profesionales',
        description:
          'Creamos páginas web modernas y responsive. Incluye diseño personalizado, SEO básico y capacitación. Entrega en 2 semanas.',
        categoryId: serviciosCategory.id,
        businessId: business2.id,
        tenantId: mainTenant.id,
        userId: seller2.id,
        price: 1500,
        priceType: 'FIXED',
        currency: 'PEN',
        city: 'Lima',
        country: 'PE',
        status: 'ACTIVE',
        featured: true,
        metadata: {
          service_type: 'web_design',
          hourly_rate: null,
          delivery_time: '14 días',
          revisions: 3,
          includes: ['Diseño responsive', 'SEO básico', 'Hosting 1 año'],
        },
        publishedAt: new Date(),
      },
    });
  }

  console.log(`✅ Created demo listings\n`);

  // ============================================================================
  // 9. CREATE DEMO KNOWLEDGE BASE (for ADIS AI)
  // ============================================================================
  console.log('🤖 Creating knowledge base entries...');

  await prisma.businessKnowledgeBase.createMany({
    data: [
      {
        businessId: business1.id,
        question: '¿Cuál es el horario de atención?',
        answer:
          'Estamos abiertos de lunes a domingo de 12:00 PM a 10:00 PM. Los feriados abrimos de 1:00 PM a 9:00 PM.',
        category: 'horario',
      },
      {
        businessId: business1.id,
        question: '¿Tienen delivery?',
        answer:
          'Sí, hacemos delivery en toda la ciudad de Cusco. El costo es de S/5 y es gratis en compras mayores a S/50.',
        category: 'delivery',
      },
      {
        businessId: business1.id,
        question: '¿Cuál es su plato más popular?',
        answer:
          'Nuestro plato estrella es el Chiri Uchu, preparado con receta tradicional familiar. También son muy populares el Cuy al Horno y el Kapchi de Setas.',
        category: 'menu',
      },
    ],
  });

  console.log(`✅ Created knowledge base entries\n`);

  // ============================================================================
  // 10. SUMMARY
  // ============================================================================
  console.log('\n🎉 Database seed completed successfully!\n');
  console.log('📊 Summary:');
  console.log(`   - Tenants: 2 (Main + Demo MaaS)`);
  console.log(`   - Users: 4 (1 admin + 3 test users)`);
  console.log(`   - Categories: 8 (All verticals)`);
  console.log(`   - Subscription Plans: 4 (Free to Enterprise)`);
  console.log(`   - Businesses: 2 (Demo pages)`);
  console.log(`   - Listings: 2 (Jobs + Services)`);
  console.log(`   - Knowledge Base: 3 entries\n`);

  console.log('🔑 Test Credentials:');
  console.log('   Admin: admin@publicadis.com / admin123');
  console.log('   Seller 1: seller1@test.com / password123');
  console.log('   Seller 2: seller2@test.com / password123');
  console.log('   Buyer: buyer@test.com / password123\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
