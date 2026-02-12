import Link from 'next/link';
import { ArrowLeft, Filter, Briefcase, Home, Car, Wrench, Package, ChevronRight } from 'lucide-react';

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const categoryName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);

  return (
    <div className="container min-h-screen py-8">
       {/* Breadcrumb */}
       <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Inicio</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">{categoryName}</span>
       </div>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
            <h1 className="text-3xl font-bold">{categoryName}</h1>
            <p className="text-muted-foreground">Explora los mejores anuncios en {categoryName}</p>
        </div>
        
        <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
                <Filter className="h-4 w-4" />
                Filtros
            </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-8 lg:grid-cols-4">
         {/* Filters Sidebar (Desktop) */}
         <div className="hidden lg:block space-y-6">
            <div className="rounded-lg border p-4">
                <h3 className="font-semibold mb-4">Categorías</h3>
                <ul className="space-y-2 text-sm">
                    <li><Link href="/c/empleos" className="block p-1 hover:text-primary">Empleos</Link></li>
                    <li><Link href="/c/inmuebles" className="block p-1 hover:text-primary">Inmuebles</Link></li>
                    <li><Link href="/c/vehiculos" className="block p-1 hover:text-primary">Vehículos</Link></li>
                    <li><Link href="/c/servicios" className="block p-1 hover:text-primary">Servicios</Link></li>
                </ul>
            </div>
            
            <div className="rounded-lg border p-4">
                <h3 className="font-semibold mb-4">Ubicación</h3>
                <div className="space-y-2 text-sm">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Lima
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Arequipa
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Cusco
                    </label>
                </div>
            </div>
         </div>

         {/* Listings */}
         <div className="lg:col-span-3">
             <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Link
                        key={i}
                        href={`/anuncio/${i}`}
                        className="group overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg"
                    >
                        <div className="aspect-video w-full bg-muted relative">
                             <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-gradient-to-br from-muted to-primary/5">
                                <span className="text-xs">Foto</span>
                             </div>
                        </div>
                        <div className="p-4">
                            <h3 className="line-clamp-2 font-semibold group-hover:text-primary">
                                Anuncio de ejemplo en {categoryName} #{i}
                            </h3>
                            <p className="mt-2 text-xl font-bold text-primary">S/ {i * 100}</p>
                            <div className="mt-2 text-sm text-muted-foreground">Hace 2 horas • Lima</div>
                        </div>
                    </Link>
                ))}
             </div>
             
             <div className="mt-12 flex justify-center">
                <button className="rounded-md border bg-background px-6 py-2 text-sm font-medium hover:bg-accent">
                    Cargar más
                </button>
             </div>
         </div>
      </div>
    </div>
  );
}





