import { apiClient } from '@/services/api/apiClient';
import { asArray, unwrapData } from '@/shared/utils/apiData';
import { paginatedParams, toPaginatedResult } from '@/shared/utils/pagination';
import { sanitizeSensitiveData } from '@/shared/utils/sensitiveText';
import type { Foto, FotosPaginadasFilters } from '@/types/foto';

export async function getFotosEvento(eventoId: string) { const r = await apiClient.get(`/Fotos/evento/${eventoId}`); return sanitizeSensitiveData(asArray<Foto>(r.data)); }
export async function getFotosEventoPaginado(eventoId: string, filters: FotosPaginadasFilters = {}) { const r = await apiClient.get(`/Fotos/evento/${eventoId}/paginado`, { params: paginatedParams(filters) }); return sanitizeSensitiveData(toPaginatedResult<Foto>(r.data)); }
export async function getFoto(id: string) { const r = await apiClient.get(`/Fotos/${id}`); return sanitizeSensitiveData(unwrapData<Foto | null>(r.data, null)); }
