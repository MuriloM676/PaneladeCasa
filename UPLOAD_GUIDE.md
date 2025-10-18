# Sistema de Upload de Imagens

## 📸 Configuração Implementada

### Backend (NestJS + Multer)

**Endpoint:** `POST /api/upload/image`

**Características:**
- ✅ Autenticação JWT obrigatória
- ✅ Validação de tipo de arquivo (jpg, jpeg, png, gif, webp)
- ✅ Limite de tamanho: 5MB
- ✅ Armazenamento local em `/uploads`
- ✅ Geração automática de nomes únicos
- ✅ Persistência via Docker volume

**Resposta de sucesso:**
```json
{
  "filename": "file-1729200000000-123456789.jpg",
  "originalName": "minha-foto.jpg",
  "url": "/uploads/file-1729200000000-123456789.jpg",
  "size": 245678,
  "mimetype": "image/jpeg"
}
```

### Frontend (React Component)

**Componente:** `ImageUpload.tsx`

**Props:**
- `onUpload: (url: string) => void` - Callback com URL da imagem
- `currentImage?: string` - URL da imagem atual (opcional)
- `label?: string` - Texto do botão (padrão: "Selecionar imagem")
- `accept?: string` - Tipos aceitos (padrão: "image/*")

**Funcionalidades:**
- ✅ Preview local antes do upload
- ✅ Validação client-side (tipo e tamanho)
- ✅ Estados de loading e erro
- ✅ Botões para alterar/remover imagem
- ✅ Feedback visual com hover

## 🎯 Como Usar

### 1. Backend - Adicionar campo de imagem no DTO

```typescript
// src/modules/dishes/dto/create-dish.dto.ts
export class CreateDishDto {
  @IsString()
  name: string;
  
  @IsString()
  @IsOptional()
  photoUrl?: string; // ← Campo para URL da imagem
  
  // ... outros campos
}
```

### 2. Frontend - Usar o componente

```tsx
'use client';

import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';

export default function CreateDishPage() {
  const [photoUrl, setPhotoUrl] = useState('');
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const dishData = {
      name: 'Feijoada',
      photoUrl, // ← URL da imagem uploadada
      // ... outros campos
    };
    
    // Enviar para API
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <ImageUpload
        onUpload={setPhotoUrl}
        currentImage={photoUrl}
        label="Foto do prato"
      />
      
      {/* Outros campos do formulário */}
    </form>
  );
}
```

## 🗂️ Estrutura de Arquivos

```
backend/
├── src/
│   ├── modules/
│   │   └── upload/
│   │       ├── upload.controller.ts  ← Endpoint de upload
│   │       └── upload.module.ts
│   └── main.ts                       ← Config de arquivos estáticos
├── uploads/                          ← Pasta de uploads (gitignored)
└── Dockerfile                        ← Cria pasta uploads

frontend/
└── src/
    └── components/
        └── ImageUpload.tsx            ← Componente reutilizável
```

## 🐳 Docker

**Volume persistente:**
```yaml
volumes:
  uploads:/app/apps/backend/uploads
```

As imagens são preservadas entre restarts do container.

## 🔒 Segurança

✅ **Implementado:**
- Autenticação JWT obrigatória
- Validação de tipo de arquivo
- Limite de tamanho (5MB)
- Nomes de arquivo únicos (previne conflitos)

⚠️ **Recomendações para Produção:**
- Usar serviço de armazenamento externo (S3, Cloudinary, etc.)
- Adicionar scan de vírus
- Redimensionamento automático de imagens
- CDN para distribuição

## 📝 Próximos Passos

1. **Integrar com formulários existentes:**
   - Criar/editar pratos (Dish)
   - Perfil de chef (Chef avatar e cover)
   - Categorias de menu (MenuCategory)

2. **Melhorias opcionais:**
   - Upload múltiplo (galeria de fotos)
   - Crop/redimensionamento no frontend
   - Compressão automática
   - Integração com Cloudinary ou S3

## 🧪 Testar

1. Fazer login na aplicação
2. Acessar qualquer formulário com ImageUpload
3. Selecionar uma imagem (máx 5MB)
4. Verificar preview
5. Submeter formulário
6. Imagem será salva em `http://localhost:4000/uploads/[filename]`
