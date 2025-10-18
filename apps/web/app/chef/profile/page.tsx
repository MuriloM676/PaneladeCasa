'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ImageUpload from '../../../src/components/ImageUpload';

interface ChefProfile {
  id: string;
  kitchenName: string;
  bio: string;
  cuisineTypes: string[];
  location: string;
  avatarUrl?: string;
  coverUrl?: string;
}

export default function ChefProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [profile, setProfile] = useState<ChefProfile>({
    id: '',
    kitchenName: '',
    bio: '',
    cuisineTypes: [],
    location: '',
    avatarUrl: '',
    coverUrl: '',
  });

  useEffect(() => {
    if (user?.role === 'CHEF') {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/chefs/profile/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/chefs/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar perfil');
      }

      setSuccess('Perfil atualizado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setProfile({
            ...profile,
            location: `${latitude},${longitude}`,
          });
          setSuccess('Localização capturada com sucesso!');
          setTimeout(() => setSuccess(''), 3000);
        },
        (error) => {
          setError('Erro ao obter localização: ' + error.message);
        }
      );
    } else {
      setError('Geolocalização não suportada pelo navegador');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleCuisineTypesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const types = e.target.value.split(',').map((t) => t.trim());
    setProfile({ ...profile, cuisineTypes: types });
  };

  if (!user || user.role !== 'CHEF') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
          <p className="text-gray-600">Apenas chefs podem acessar esta página.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Meu Perfil</h1>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Imagem de Capa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagem de Capa
                </label>
                <div className="aspect-[3/1] max-h-64">
                  <ImageUpload
                    onUpload={(url: string) => setProfile({ ...profile, coverUrl: url })}
                    currentImage={profile.coverUrl}
                    label="Adicionar capa do perfil"
                  />
                </div>
              </div>

              {/* Avatar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto de Perfil (Avatar)
                </label>
                <div className="max-w-xs">
                  <ImageUpload
                    onUpload={(url: string) => setProfile({ ...profile, avatarUrl: url })}
                    currentImage={profile.avatarUrl}
                    label="Adicionar foto de perfil"
                  />
                </div>
              </div>

              {/* Nome da Cozinha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Cozinha *
                </label>
                <input
                  type="text"
                  name="kitchenName"
                  value={profile.kitchenName}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Sabores da Vovó"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Biografia */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biografia
                </label>
                <textarea
                  name="bio"
                  value={profile.bio || ''}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Conte sua história, sua experiência culinária, o que te inspira..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Tipos de Culinária */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipos de Culinária (separados por vírgula)
                </label>
                <input
                  type="text"
                  value={profile.cuisineTypes.join(', ')}
                  onChange={handleCuisineTypesChange}
                  placeholder="Ex: Brasileira, Italiana, Vegana"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Localização */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localização
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="location"
                    value={profile.location || ''}
                    onChange={handleChange}
                    placeholder="Ex: São Paulo, SP ou coordenadas"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                  >
                    📍 Usar Minha Localização
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Clique no botão para capturar sua localização atual automaticamente
                </p>
              </div>

              {/* Botão Salvar */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 disabled:bg-gray-400 transition-colors"
                >
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
