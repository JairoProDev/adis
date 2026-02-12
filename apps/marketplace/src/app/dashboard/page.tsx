import Link from 'next/link';
import { User, Package, Heart, Settings, LogOut, MapPin, Calendar } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b px-4 py-3">
         <div className="container flex items-center justify-between">
            <Link href="/" className="font-bold text-xl">Buscadis</Link>
            <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Hola, Usuario</span>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                </div>
            </div>
         </div>
      </header>

      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-4">
            {/* Sidebar Navigation */}
            <aside className="space-y-2">
                <nav className="flex flex-col gap-1">
                    <Link href="/dashboard" className="flex items-center gap-3 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
                        <User className="h-4 w-4" />
                        Mi Perfil
                    </Link>
                    <Link href="/dashboard/anuncios" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                        <Package className="h-4 w-4" />
                        Mis Anuncios
                    </Link>
                    <Link href="/dashboard/favoritos" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                        <Heart className="h-4 w-4" />
                        Favoritos
                    </Link>
                    <Link href="/dashboard/ajustes" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                        <Settings className="h-4 w-4" />
                        Configuración
                    </Link>
                    <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                        <LogOut className="h-4 w-4" />
                        Cerrar Sesión
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-3 space-y-6">
                <div className="rounded-lg border bg-card p-6">
                    <h2 className="text-lg font-semibold mb-4">Resumen de Cuenta</h2>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        <div className="rounded-md border p-4">
                            <div className="text-2xl font-bold">0</div>
                            <div className="text-sm text-muted-foreground">Anuncios Activos</div>
                        </div>
                        <div className="rounded-md border p-4">
                            <div className="text-2xl font-bold">12</div>
                            <div className="text-sm text-muted-foreground">Visitas esta semana</div>
                        </div>
                        <div className="rounded-md border p-4">
                            <div className="text-2xl font-bold">5</div>
                            <div className="text-sm text-muted-foreground">Mensajes nuevos</div>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Mis Anuncios Recientes</h2>
                        <Link href="/publicar" className="text-sm text-primary hover:underline">
                            Publicar nuevo
                        </Link>
                    </div>
                    
                    {/* Empty State */}
                    <div className="flex flex-col items-center justify-center py-12 text-center border rounded-md border-dashed">
                        <Package className="h-10 w-10 text-muted-foreground mb-3" />
                        <h3 className="text-sm font-medium">No tienes anuncios publicados</h3>
                        <p className="text-xs text-muted-foreground mt-1 mb-4">
                            ¡Publica tu primer anuncio y empieza a vender hoy!
                        </p>
                        <Link href="/publicar" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                            Publicar Ahora
                        </Link>
                    </div>
                </div>
            </main>
        </div>
      </div>
    </div>
  );
}





