export const metadata = { title: 'Panela de Casa' };
import './globals.css';
import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="border-b bg-white">
            <div className="max-w-6xl mx-auto px-4 py-3 font-semibold">Panela de Casa</div>
          </header>
          <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">{children}</main>
          <footer className="border-t bg-white">
            <div className="max-w-6xl mx-auto px-4 py-3 text-sm text-gray-500">© {new Date().getFullYear()} Panela de Casa</div>
          </footer>
        </div>
      </body>
    </html>
  );
}
