import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { GraphQLProvider } from '@/lib/apollo/provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Publicadis Pages - Tu presencia digital completa',
  description:
    'Crea tu página de negocio profesional en minutos. La mejor alternativa a Linktree para negocios en Latinoamérica.',
  keywords: [
    'pagina de negocio',
    'linktree',
    'bio link',
    'presencia digital',
    'marketplace',
    'peru',
    'latinoamerica',
  ],
  authors: [{ name: 'Publicadis' }],
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Publicadis Pages',
    title: 'Publicadis Pages - Tu presencia digital completa',
    description: 'Crea tu página de negocio profesional en minutos',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Publicadis Pages',
    description: 'Tu presencia digital completa',
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
