import Link from 'next/link';
import { Camera, Upload, ArrowRight, Sparkles } from 'lucide-react';

export default function PublishPage() {
  return (
    <div className="container max-w-3xl py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Publicar Anuncio</h1>
        <p className="mt-2 text-muted-foreground">
          Completa la información para publicar tu anuncio gratis
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <form className="space-y-8">
          {/* Categoría */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">1. ¿Qué vas a publicar?</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {['Inmuebles', 'Vehículos', 'Servicios', 'Empleos', 'Productos', 'Otros'].map(
                (cat) => (
                  <label
                    key={cat}
                    className="flex cursor-pointer items-center justify-center rounded-md border bg-background p-4 text-center text-sm font-medium hover:border-primary hover:bg-primary/5"
                  >
                    <input type="radio" name="category" className="sr-only" />
                    {cat}
                  </label>
                )
              )}
            </div>
          </div>

          {/* Detalles */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">2. Detalles del anuncio</h2>
            
            <div>
              <label className="block text-sm font-medium mb-1">Título</label>
              <input 
                type="text" 
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Ej: Departamento en Miraflores 2 dorm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea 
                rows={5}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Describe tu anuncio..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Precio (S/)</label>
                  <input 
                    type="number" 
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="0.00"
                  />
                </div>
                <div>
                   <label className="block text-sm font-medium mb-1">Ubicación</label>
                    <select className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50">
                        <option>Lima</option>
                        <option>Arequipa</option>
                        <option>Cusco</option>
                        <option>Trujillo</option>
                    </select>
                </div>
            </div>
          </div>

          {/* Fotos */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">3. Fotos</h2>
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed p-12 hover:bg-muted/50">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
                <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-semibold text-primary hover:text-primary/80"
                  >
                    <span>Sube fotos</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                  </label>
                  <p className="pl-1">o arrastra y suelta</p>
                </div>
                <p className="text-xs leading-5 text-muted-foreground">PNG, JPG, GIF hasta 10MB</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 flex items-center justify-end gap-4">
             <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Cancelar
             </Link>
             <button 
                type="button"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
             >
                Publicar anuncio
                <ArrowRight className="h-4 w-4" />
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}





