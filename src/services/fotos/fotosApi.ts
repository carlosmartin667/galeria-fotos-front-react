import { apiClient } from '@/services/api/apiClient';
import { asArray, unwrapData } from '@/shared/utils/apiData';
import { sanitizeSensitiveData } from '@/shared/utils/sensitiveText';
import type { Foto } from '@/types/foto';
export async function getFotos() { const r = await apiClient.get('/Fotos'); return sanitizeSensitiveData(asArray<Foto>(r.data)); }
export async function getFotosEvento(eventoId: string) { const r = await apiClient.get(`/Fotos/evento/${eventoId}`); return sanitizeSensitiveData(asArray<Foto>(r.data)); }
export async function getFoto(id: string) { const r = await apiClient.get(`/Fotos/${id}`); return sanitizeSensitiveData(unwrapData<Foto | null>(r.data, null)); }
