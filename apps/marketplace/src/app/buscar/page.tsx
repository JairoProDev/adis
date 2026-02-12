import Link from 'next/link';
import { ArrowLeft, Search, Filter, MapPin } from 'lucide-react';

export default function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = searchParams.q || '';

  return (
    <div className="container min-h-screen py-8">
      {/* Header Search */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
            <Link href="/" className="mb-2 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                <ArrowLeft className="h-4 w-4" />
                Volver al inicio
            </Link>
            <h1 className="text-3xl font-bold">
            {query ? `Resultados para "${query}"` : 'Explorar anuncios'}
            </h1>
            <p className="text-muted-foreground">Encontrados 0 resultados</p>
        </div>
        
        <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
                <Filter className="h-4 w-4" />
                Filtros
            </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-24 text-center">
        <div className="rounded-full bg-muted p-6">
          <Search className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No se encontraron resultados</h3>
        <p className="mt-2 text-muted-foreground">
          Intenta con otros términos de búsqueda o navega por categorías.
        </p>
        <Link
          href="/categorias"
          className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Ver todas las categorías
        </Link>
      </div>
    </div>
  );
}





