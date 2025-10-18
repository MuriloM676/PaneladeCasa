'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-orange-600 hover:text-orange-700">
          🍳 Panela de Casa
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/" className="text-gray-700 hover:text-orange-600 transition">
            Chefs
          </Link>

          {!isLoading && (
            <>
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {user.email}
                    {user.role === 'CHEF' && (
                      <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                        Chef
                      </span>
                    )}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-700 hover:text-orange-600 transition"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    href="/login"
                    className="text-sm text-gray-700 hover:text-orange-600 transition"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition"
                  >
                    Cadastrar
                  </Link>
                </div>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
