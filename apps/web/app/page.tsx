'use client';

import { useEffect, useState } from 'react';
import { ChefCard } from '../components/ChefCard';
import { useRouter } from 'next/navigation';

interface Chef {
  id: string;
  kitchenName: string;
  bio?: string;
  cuisineTypes: string[];
  location?: string;
}

export default function Home() {
  const [chefs, setChefs] = useState<Chef[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/chefs')
      .then((r) => r.json())
      .then((payload) => {
        const list = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
        setChefs(
          list.map((c: any) => ({
            id: c.id,
            kitchenName: c.kitchenName,
            bio: c.bio,
            cuisineTypes: c.cuisineTypes ?? [],
            location: c.location,
          }))
        );
      })
      .catch((err) => {
        console.error('Falha ao carregar chefs', err);
      });
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Descubra Chefs Caseiros</h1>
      <p>Busque por localização, culinária e avaliações (MVP).</p>
      {chefs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center max-w-2xl mx-auto mt-8">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhum Chef Disponível</h2>
          <p className="text-gray-600">
            Ainda não há chefs cadastrados. Volte em breve para descobrir deliciosas opções!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {chefs.map((chef) => (
            <ChefCard key={chef.id} chef={chef} onViewMenu={(id) => router.push(`/chef/${id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}
