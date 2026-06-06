import { apiClient } from '@/services/api/apiClient';
import { asArray, unwrapData } from '@/shared/utils/apiData';
import { sanitizeSensitiveData } from '@/shared/utils/sensitiveText';
import type { Evento } from '@/types/evento';
export async function getEventos() { const r = await apiClient.get('/Eventos'); return sanitizeSensitiveData(asArray<Evento>(r.data)); }
export async function getEvento(id: string) { const r = await apiClient.get(`/Eventos/${id}`); return sanitizeSensitiveData(unwrapData<Evento | null>(r.data, null)); }
