import Link from 'next/link';
import { Plus, Settings, ExternalLink, BarChart3, Globe } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Navbar */}
      <nav className="border-b bg-background px-4 py-3 shadow-sm">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="h-8 w-8 rounded bg-primary" />
             <span className="font-bold">Publicadis Pages</span>
          </div>
          <div className="flex items-center gap-4">
             <button className="h-8 w-8 rounded-full bg-muted" />
          </div>
        </div>
      </nav>

      <main className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Mis Páginas</h1>
            <p className="text-muted-foreground">Gestiona tus sitios web y landing pages</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Nueva Página
          </button>
        </div>

        {/* Empty State (or List) */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
           {/* Example Page Card */}
           <div className="overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md">
              <div className="aspect-video w-full bg-muted relative group">
                 <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <Link href="#" className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-100">
                        Editar Diseño
                    </Link>
                 </div>
              </div>
              <div className="p-4">
                 <div className="mb-4 flex items-start justify-between">
                    <div>
                        <h3 className="font-semibold">Mi Negocio Ejemplo</h3>
                        <a href="#" className="flex items-center gap-1 text-xs text-primary hover:underline">
                            <Globe className="h-3 w-3" />
                            publicadis.pages.dev/mi-negocio
                        </a>
                    </div>
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        Publicado
                    </span>
                 </div>
                 
                 <div className="grid grid-cols-3 gap-2 border-t pt-4 text-center">
                    <div>
                        <div className="text-lg font-bold">1.2k</div>
                        <div className="text-xs text-muted-foreground">Visitas</div>
                    </div>
                    <div>
                        <div className="text-lg font-bold">45</div>
                        <div className="text-xs text-muted-foreground">Clicks</div>
                    </div>
                    <div>
                        <div className="text-lg font-bold">3.8%</div>
                        <div className="text-xs text-muted-foreground">CTR</div>
                    </div>
                 </div>

                 <div className="mt-4 flex gap-2">
                    <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border bg-background py-2 text-sm font-medium hover:bg-accent">
                        <BarChart3 className="h-4 w-4" />
                        Analytics
                    </button>
                    <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border bg-background py-2 text-sm font-medium hover:bg-accent">
                        <Settings className="h-4 w-4" />
                        Ajustes
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}





