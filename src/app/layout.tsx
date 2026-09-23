import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { ProductStorageProvider } from '@/context/ProductStorageContext';
import { ToastProvider } from '@/context/ToastContext';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Nexgensis | Product Admin Dashboard',
  description: 'Crafted enterprise product management dashboard with Impeccable design system.',
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
