'use client';

import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { Playfair_Display, Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import StripeProvider from './providers/StripProvider';

const serif = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans antialiased text-slate-950 bg-[#FDFCFB] selection:bg-orange-100">
        <CartProvider>
  <AuthProvider>
    <StripeProvider>
      {!isAdmin && <Navbar />}
      <div className={`min-h-screen flex flex-col ${isAdmin ? '' : 'pt-16 md:pt-28'}`}>
        <main className="flex-1">{children}</main>
        {!isAdmin && <Footer />}
      </div>
    </StripeProvider>
  </AuthProvider>
</CartProvider>
      </body>
    </html>
  );
}
