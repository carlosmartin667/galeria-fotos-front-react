import { apiClient } from '@/services/api/apiClient';
import { asArray } from '@/shared/utils/apiData';
import { sanitizeSensitiveData } from '@/shared/utils/sensitiveText';
import type { Favorito } from '@/types/favorito';
export async function getFavoritos() { const [eventos, fotos] = await Promise.all([apiClient.get('/Favoritos/eventos'), apiClient.get('/Favoritos/fotos')]); return sanitizeSensitiveData([...asArray<Favorito>(eventos.data), ...asArray<Favorito>(fotos.data)]); }
export async function addFotoFavorito(fotoId: string) { const r = await apiClient.post(`/Favoritos/fotos/${fotoId}`); return r.data; }
export async function removeFotoFavorito(fotoId: string) { const r = await apiClient.delete(`/Favoritos/fotos/${fotoId}`); return r.data; }
