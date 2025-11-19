import Link from 'next/link';
import { ArrowRight, Check, Sparkles, Zap, Globe, BarChart3 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Publicadis Pages</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm font-medium hover:text-primary">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary">
              Precios
            </Link>
            <Link href="/login" className="text-sm font-medium hover:text-primary">
              Ingresar
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Comenzar Gratis
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container flex flex-col items-center justify-center gap-8 py-24 text-center md:py-32">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm">
          <Zap className="h-4 w-4 text-yellow-500" />
          <span>Gratis para siempre • Sin tarjeta de crédito</span>
        </div>

        <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          Tu{' '}
          <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            presencia digital
          </span>{' '}
          completa en un solo lugar
        </h1>

        <p className="max-w-2xl text-xl text-muted-foreground">
          Más que un Linktree. Crea tu página de negocio profesional, conecta con clientes y crece
          tu negocio. Todo en una plataforma diseñada para Latinoamérica.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-4 text-lg font-medium text-primary-foreground hover:bg-primary/90"
          >
            Crear mi página gratis
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="#examples"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-8 py-4 text-lg font-medium hover:bg-accent"
          >
            Ver ejemplos
          </Link>
        </div>

        <div className="flex flex-col items-center gap-2 pt-8">
          <div className="flex -space-x-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-10 rounded-full border-2 border-background bg-gradient-to-br from-primary to-purple-500"
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Más de <strong className="text-foreground">10,000 negocios</strong> confían en nosotros
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t bg-muted/50 py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Todo lo que necesitas para crecer tu negocio
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              No solo enlaces. Una página completa para tu negocio.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border bg-background p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Precios transparentes</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Comienza gratis. Escala cuando lo necesites.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg border p-8 ${
                  plan.popular ? 'border-primary shadow-lg' : 'bg-muted/30'
                }`}
              >
                {plan.popular && (
                  <div className="mb-4 inline-block rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Más Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-bold">S/{plan.price}</span>
                  <span className="text-muted-foreground">/mes</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className={`mt-8 block w-full rounded-md py-3 text-center font-medium ${
                    plan.popular
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'border border-input bg-background hover:bg-accent'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-primary py-24 text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            ¿Listo para hacer crecer tu negocio?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90">
            Únete a miles de negocios que ya están creciendo con Publicadis Pages
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-background px-8 py-4 text-lg font-medium text-primary hover:bg-background/90"
          >
            Crear mi página gratis
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-bold">Publicadis</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                La infraestructura de clasificados de próxima generación para LATAM
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Producto</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-primary">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-primary">
                    Precios
                  </Link>
                </li>
                <li>
                  <Link href="/marketplace" className="hover:text-primary">
                    Marketplace
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">Empresa</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-primary">
                    Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-primary">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-primary">
                    Carreras
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">Legal</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy" className="hover:text-primary">
                    Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-primary">
                    Términos
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            © 2025 Publicadis. Todos los derechos reservados. Hecho con ❤️ en Perú
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Globe,
    title: 'Página Profesional',
    description:
      'Tu propio sitio web con dominio personalizado. No más enlaces genéricos.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Completos',
    description:
      'Sigue cada visita, click y conversión. Toma decisiones basadas en datos.',
  },
  {
    icon: Zap,
    title: 'Setup en Minutos',
    description:
      'Crea tu página en menos de 5 minutos. Sin código, sin complicaciones.',
  },
  {
    icon: Check,
    title: 'WhatsApp Integrado',
    description: 'Conecta directo con tus clientes vía WhatsApp con un solo click.',
  },
  {
    icon: Sparkles,
    title: 'SEO Optimizado',
    description: 'Aparece en Google. Tu página está optimizada para buscadores.',
  },
  {
    icon: ArrowRight,
    title: 'Crece al Marketplace',
    description:
      'Cuando estés listo, publica anuncios en nuestro marketplace sin costo extra.',
  },
];

const pricingPlans = [
  {
    name: 'Gratis',
    price: 0,
    description: 'Perfecto para empezar',
    cta: 'Comenzar Gratis',
    popular: false,
    features: [
      '1 página de negocio',
      'Enlaces ilimitados',
      'Analytics básicos',
      'WhatsApp integrado',
      'Temas personalizables',
    ],
  },
  {
    name: 'Pro',
    price: 49,
    description: 'Para negocios en crecimiento',
    cta: 'Comenzar Pro',
    popular: true,
    features: [
      'Todo en Gratis, más:',
      'Dominio personalizado',
      'Sin marca Publicadis',
      'Analytics avanzados',
      '10 anuncios en Marketplace',
      'Teléfono visible',
      'Soporte prioritario',
    ],
  },
  {
    name: 'Business',
    price: 149,
    description: 'Para empresas establecidas',
    cta: 'Comenzar Business',
    popular: false,
    features: [
      'Todo en Pro, más:',
      'Múltiples páginas',
      '50 anuncios en Marketplace',
      'ADIS AI asistente',
      'API access',
      'Integración Zapier',
      'Account manager dedicado',
    ],
  },
];
