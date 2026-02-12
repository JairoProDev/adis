import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { GraphQLProvider } from '@/lib/apollo/provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Buscadis - Encuentra todo en Latinoamérica',
  description:
    'El marketplace más completo de LATAM. Empleos, servicios, inmuebles, vehículos y más. Encuentra lo que buscas cerca de ti.',
  keywords: [
    'marketplace',
    'clasificados',
    'empleos',
    'servicios',
    'inmuebles',
    'vehiculos',
    'peru',
    'latinoamerica',
    'buscadis',
  ],
  authors: [{ name: 'Publicadis' }],
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Buscadis',
    title: 'Buscadis - Encuentra todo en Latinoamérica',
    description: 'El marketplace más completo de LATAM',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <GraphQLProvider>
             {children}
          </GraphQLProvider>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
