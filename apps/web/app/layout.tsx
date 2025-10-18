export const metadata = { title: 'Panela de Casa' };
import './globals.css';
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '../src/app/context/CartContext';
import Navbar from '@/components/Navbar';
import CartSidebar from '../src/components/CartSidebar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">{children}</main>
              <CartSidebar />
              <footer className="border-t bg-white">
                <div className="max-w-6xl mx-auto px-4 py-3 text-sm text-gray-500">© {new Date().getFullYear()} Panela de Casa</div>
              </footer>
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
