import Link from 'next';
import {
  Search,
  Briefcase,
  Wrench,
  Home,
  Car,
  Package,
  Calendar,
  Building2,
  Users,
  MapPin,
  TrendingUp,
  Clock,
  Heart,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Search className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Buscadis</span>
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
              {categories.slice(0, 4).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/c/${cat.slug}`}
                  className="text-sm font-medium hover:text-primary"
                >
                  {cat.name}
                </Link>
              ))}
              <Link href="/categorias" className="text-sm font-medium hover:text-primary">
                Todas
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/favoritos" className="text-sm font-medium hover:text-primary">
              <Heart className="h-5 w-5" />
            </Link>
            <Link href="/login" className="text-sm font-medium hover:text-primary">
              Ingresar
            </Link>
            <Link
              href="/publicar"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Publicar Gratis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero with Search */}
      <section className="border-b bg-gradient-to-b from-muted/50 to-background py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Encuentra{' '}
              <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                todo lo que buscas
              </span>
            </h1>
            <p className="mt-4 text-xl text-muted-foreground">
              Empleos, servicios, inmuebles, vehículos y más cerca de ti
            </p>

            {/* Search Bar */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="¿Qué estás buscando?"
                  className="h-12 w-full rounded-lg border bg-background pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="relative sm:w-48">
                <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <select className="h-12 w-full appearance-none rounded-lg border bg-background pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Lima</option>
                  <option>Cusco</option>
                  <option>Arequipa</option>
                  <option>Trujillo</option>
                  <option>Todas las ciudades</option>
                </select>
              </div>
              <button className="h-12 rounded-lg bg-primary px-8 font-medium text-primary-foreground hover:bg-primary/90">
                Buscar
              </button>
            </div>

            {/* Quick Search Tags */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground">Popular:</span>
              {['Desarrollador', 'Departamento', 'Toyota', 'Laptop'].map((tag) => (
                <Link
                  key={tag}
                  href={`/buscar?q=${tag}`}
                  className="rounded-full border bg-background px-3 py-1 text-sm hover:border-primary hover:text-primary"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Explora por categoría</h2>
            <Link href="/categorias" className="text-sm font-medium text-primary hover:underline">
              Ver todas →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/c/${category.slug}`}
                className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:border-primary hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <category.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.count} anuncios</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="border-t bg-muted/30 py-16">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Anuncios destacados</h2>
              <p className="mt-1 text-muted-foreground">Los mejores anuncios de esta semana</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
                <TrendingUp className="mr-2 inline h-4 w-4" />
                Populares
              </button>
              <button className="rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
                <Clock className="mr-2 inline h-4 w-4" />
                Recientes
              </button>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Link
                key={i}
                href={`/anuncio/${i}`}
                className="group overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg"
              >
                {/* Image */}
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <div className="h-full w-full bg-gradient-to-br from-primary/20 to-emerald-500/20" />
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 font-semibold group-hover:text-primary">
                      Desarrollador Full Stack Senior - Remoto
                    </h3>
                  </div>
                  <p className="mb-3 text-2xl font-bold text-primary">S/5,000</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Lima, Perú</span>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">Hace 2 horas</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold">¿Cómo funciona?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Publicar y encontrar es muy fácil
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {howItWorks.map((step, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  {i + 1}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/publicar"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3 text-lg font-medium text-primary-foreground hover:bg-primary/90"
            >
              Publicar mi primer anuncio gratis
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-primary py-16 text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold">¿Tienes un negocio?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90">
            Crea tu página profesional gratis con Publicadis Pages y llega a más clientes
          </p>
          <Link
            href="https://pages.publicadis.com"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-background px-8 py-3 text-lg font-medium text-primary hover:bg-background/90"
          >
            Crear mi página gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                <span className="font-bold">Buscadis</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                El marketplace más completo de Latinoamérica
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Categorías</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {categories.slice(0, 4).map((cat) => (
                  <li key={cat.slug}>
                    <Link href={`/c/${cat.slug}`} className="hover:text-primary">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">Empresa</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/nosotros" className="hover:text-primary">
                    Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="/ayuda" className="hover:text-primary">
                    Ayuda
                  </Link>
                </li>
                <li>
                  <Link href="/seguridad" className="hover:text-primary">
                    Seguridad
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">Legal</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/terminos" className="hover:text-primary">
                    Términos
                  </Link>
                </li>
                <li>
                  <Link href="/privacidad" className="hover:text-primary">
                    Privacidad
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            © 2025 Buscadis by Publicadis. Hecho con ❤️ en Perú
          </div>
        </div>
      </footer>
    </div>
  );
}

const categories = [
  {
    name: 'Empleos',
    slug: 'empleos',
    icon: Briefcase,
    count: '1,234',
  },
  {
    name: 'Servicios',
    slug: 'servicios',
    icon: Wrench,
    count: '856',
  },
  {
    name: 'Inmuebles',
    slug: 'inmuebles',
    icon: Home,
    count: '2,145',
  },
  {
    name: 'Vehículos',
    slug: 'vehiculos',
    icon: Car,
    count: '567',
  },
  {
    name: 'Productos',
    slug: 'productos',
    icon: Package,
    count: '3,421',
  },
  {
    name: 'Eventos',
    slug: 'eventos',
    icon: Calendar,
    count: '234',
  },
  {
    name: 'Negocios',
    slug: 'negocios',
    icon: Building2,
    count: '89',
  },
  {
    name: 'Comunidad',
    slug: 'comunidad',
    icon: Users,
    count: '456',
  },
];

const howItWorks = [
  {
    title: 'Publica gratis',
    description: 'Crea tu anuncio en menos de 2 minutos con fotos y descripción',
  },
  {
    title: 'Conecta',
    description: 'Recibe mensajes, llamadas y WhatsApp de personas interesadas',
  },
  {
    title: 'Vende',
    description: 'Cierra el trato de forma segura con nuestro sistema de confianza',
  },
];
