import { apiClient } from '@/services/api/apiClient';
import { asArray } from '@/shared/utils/apiData';
import { paginatedParams, toPaginatedResult } from '@/shared/utils/pagination';
import { sanitizeSensitiveData } from '@/shared/utils/sensitiveText';
import type { Favorito } from '@/types/favorito';
import type { PaginacionFilters } from '@/types/paginacion';
export async function getFavoritos() { const [eventos, fotos] = await Promise.all([apiClient.get('/Favoritos/eventos'), apiClient.get('/Favoritos/fotos')]); return sanitizeSensitiveData([...asArray<Favorito>(eventos.data), ...asArray<Favorito>(fotos.data)]); }
export async function getFavoritosEventosPaginado(filters: PaginacionFilters = {}) { const r = await apiClient.get('/Favoritos/eventos/paginado', { params: paginatedParams(filters) }); return sanitizeSensitiveData(toPaginatedResult<Favorito>(r.data)); }
export async function getFavoritosFotosPaginado(filters: PaginacionFilters = {}) { const r = await apiClient.get('/Favoritos/fotos/paginado', { params: paginatedParams(filters) }); return sanitizeSensitiveData(toPaginatedResult<Favorito>(r.data)); }
export async function addFotoFavorito(fotoId: string) { const r = await apiClient.post(`/Favoritos/fotos/${fotoId}`); return r.data; }
export async function removeFotoFavorito(fotoId: string) { const r = await apiClient.delete(`/Favoritos/fotos/${fotoId}`); return r.data; }
