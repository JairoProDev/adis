'use client';

import Link from 'next/link';
import { ArrowLeft, Search, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { SIGNUP } from '@/lib/apollo/queries';
import { useState } from 'react';

export default function SignupPage() {
  const router = useRouter();
  const [signup, { loading }] = useMutation(SIGNUP);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const { data } = await signup({
        variables: {
          input: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
          },
        },
      });

      if (data?.signup?.accessToken) {
        // Save token
        localStorage.setItem('token', data.signup.accessToken);
        localStorage.setItem('user', JSON.stringify(data.signup.user));

        toast.success('Cuenta creada exitosamente. ¡Bienvenido!');
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      toast.error(err.message || 'Error al crear la cuenta. Intenta nuevamente.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="mb-4 flex items-center gap-2 text-primary hover:text-primary/90">
             <Search className="h-6 w-6" />
             <span className="text-xl font-bold">Buscadis</span>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Crea tu cuenta gratis</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Encuentra y publica anuncios gratis en minutos
          </p>
        </div>

        <div className="rounded-lg border bg-background p-8 shadow-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
             <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-foreground">
                    Nombre
                  </label>
                  <div className="mt-1">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-foreground">
                    Apellido
                  </label>
                  <div className="mt-1">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
             </div>

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
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
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
                    Creando cuenta...
                  </>
                ) : (
                  'Crear cuenta'
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
                  ¿Ya tienes una cuenta?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link href="/login" className="font-medium text-primary hover:text-primary/90">
                Ingresa aquí
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
