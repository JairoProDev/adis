import Link from 'next/link';
import { ArrowLeft, Heart, Share2, MapPin, User, ShieldCheck, MessageCircle, Phone } from 'lucide-react';

export default function ListingPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-8">
      <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" />
        Volver a resultados
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Gallery Placeholder */}
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
             <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50 text-muted-foreground">
                <span className="text-sm">Galería de imágenes (ID: {params.id})</span>
             </div>
          </div>

          {/* Title & Price */}
          <div>
             <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl font-bold sm:text-3xl">Título del Anuncio de Ejemplo</h1>
                <div className="flex items-center gap-2">
                    <button className="rounded-full border p-2 hover:bg-muted hover:text-primary">
                        <Heart className="h-5 w-5" />
                    </button>
                    <button className="rounded-full border p-2 hover:bg-muted hover:text-primary">
                        <Share2 className="h-5 w-5" />
                    </button>
                </div>
             </div>
             <p className="mt-2 text-3xl font-bold text-primary">S/ 1,500</p>
             <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Lima, Perú
                </div>
                <span>•</span>
                <div>Publicado hace 2 días</div>
             </div>
          </div>

          {/* Description */}
          <div className="rounded-lg border bg-card p-6">
             <h2 className="mb-4 text-lg font-semibold">Descripción</h2>
             <div className="space-y-4 text-muted-foreground">
                <p>
                    Esta es una descripción de ejemplo para el anuncio con ID {params.id}. 
                    Aquí irían los detalles completos del producto, servicio o inmueble ofrecido.
                </p>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
             </div>
          </div>
          
          {/* Attributes */}
          <div className="rounded-lg border bg-card p-6">
             <h2 className="mb-4 text-lg font-semibold">Características</h2>
             <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex flex-col rounded-md bg-muted/50 p-3">
                        <span className="text-xs text-muted-foreground">Característica {i}</span>
                        <span className="font-medium">Valor {i}</span>
                    </div>
                ))}
             </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
           <div className="sticky top-24 space-y-6">
             {/* Seller Card */}
             <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold">Usuario Vendedor</h3>
                        <div className="flex items-center gap-1 text-xs text-emerald-600">
                            <ShieldCheck className="h-3 w-3" />
                            Identidad verificada
                        </div>
                    </div>
                </div>
                
                <div className="space-y-3">
                    <button className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 font-medium text-primary-foreground hover:bg-primary/90">
                        <MessageCircle className="h-5 w-5" />
                        Enviar mensaje
                    </button>
                    <button className="flex w-full items-center justify-center gap-2 rounded-md border bg-background px-4 py-3 font-medium hover:bg-accent">
                        <Phone className="h-5 w-5" />
                        Ver teléfono
                    </button>
                </div>
             </div>
             
             {/* Safety Tips */}
             <div className="rounded-lg border bg-muted/30 p-4 text-sm">
                <h3 className="mb-2 font-semibold">Consejos de seguridad</h3>
                <ul className="list-disc space-y-1 pl-4 text-muted-foreground">
                    <li>No envíes dinero por adelantado.</li>
                    <li>Reúnete en lugares públicos y seguros.</li>
                    <li>Verifica el producto antes de comprar.</li>
                </ul>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}





