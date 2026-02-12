'use client';

import Link from 'next/link';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { LOGIN } from '@/lib/apollo/queries';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [login, { loading }] = useMutation(LOGIN);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const { data } = await login({
        variables: {
          input: {
            email,
            password,
          },
        },
      });

      if (data?.login?.accessToken) {
        localStorage.setItem('token', data.login.accessToken);
        localStorage.setItem('user', JSON.stringify(data.login.user));

        toast.success(`Bienvenido de nuevo, ${data.login.user.firstName}`);
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      toast.error(err.message || 'Error al iniciar sesión.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="mb-4 flex items-center gap-2 text-primary hover:text-primary/90">
             <Sparkles className="h-6 w-6" />
             <span className="text-xl font-bold">Publicadis Pages</span>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Bienvenido de nuevo</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Ingresa a tu cuenta para gestionar tus páginas
          </p>
        </div>

        <div className="rounded-lg border bg-background p-8 shadow-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Correo electrónico
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Contraseña
                </label>
                <div className="text-sm">
                  <Link href="#" className="font-medium text-primary hover:text-primary/90">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ingresando...
                  </>
                ) : (
                  'Ingresar'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-2 text-muted-foreground">
                  ¿No tienes una cuenta?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link href="/signup" className="font-medium text-primary hover:text-primary/90">
                Regístrate gratis
              </Link>
            </div>
          </div>
        </div>
        
        <div className="text-center">
             <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                Volver al inicio
             </Link>
        </div>
      </div>
    </div>
  );
}
