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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {chefs.map((chef) => (
          <ChefCard key={chef.id} chef={chef} onViewMenu={(id) => router.push(`/chef/${id}`)} />
        ))}
      </div>
    </div>
  );
}
