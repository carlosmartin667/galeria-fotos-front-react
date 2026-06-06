import { apiClient } from '@/services/api/apiClient';
import { asArray, unwrapData } from '@/shared/utils/apiData';
import { sanitizeSensitiveData } from '@/shared/utils/sensitiveText';
import type { Descarga } from '@/types/descarga';
export async function getDescargas() { const r = await apiClient.get('/Descargas/mis-descargas'); return sanitizeSensitiveData(asArray<Descarga>(r.data)); }
export async function getDescarga(id: string) { const r = await apiClient.get(`/Descargas/${id}`); return sanitizeSensitiveData(unwrapData<Descarga | null>(r.data, null)); }
export async function regenerarDescarga(id: string) { const r = await apiClient.post(`/Descargas/${id}/regenerar`); return sanitizeSensitiveData(r.data); }
