import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { ProductStorageProvider } from '@/context/ProductStorageContext';
import { ToastProvider } from '@/context/ToastContext';
import './globals.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-heading',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Product Admin Dashboard',
  description: 'Product admin dashboard for inventory management, catalog search, filtering, and updates.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#f9f9f8] text-[#141413] font-sans selection:bg-[#141413] selection:text-white"
      >
        <AuthProvider>
          <ProductStorageProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ProductStorageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
