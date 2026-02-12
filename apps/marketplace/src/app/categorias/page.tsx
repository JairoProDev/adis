import Link from 'next/link';
import { Briefcase, Wrench, Home, Car, Package, Calendar, Building2, Users, ArrowLeft } from 'lucide-react';

export default function CategoriesPage() {
  return (
    <div className="container min-h-screen py-8">
      <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" />
        Volver al inicio
      </Link>

      <h1 className="mb-8 text-3xl font-bold">Todas las Categorías</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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





