import { apiClient } from '@/services/api/apiClient';
import { asArray, unwrapData } from '@/shared/utils/apiData';
import { paginatedParams, toPaginatedResult } from '@/shared/utils/pagination';
import { sanitizeSensitiveData } from '@/shared/utils/sensitiveText';
import type { Evento } from '@/types/evento';
import type { CrearPaqueteEventoRequest, PaqueteEvento } from '@/types/paqueteEvento';
import type { PaginacionFilters } from '@/types/paginacion';
export async function getEventos() { const r = await apiClient.get('/Eventos'); return sanitizeSensitiveData(asArray<Evento>(r.data)); }
export async function getEventosPaginado(filters: PaginacionFilters = {}) { const r = await apiClient.get('/Eventos/paginado', { params: paginatedParams(filters) }); return sanitizeSensitiveData(toPaginatedResult<Evento>(r.data)); }
export async function getEvento(id: string) { const r = await apiClient.get(`/Eventos/${id}`); return sanitizeSensitiveData(unwrapData<Evento | null>(r.data, null)); }
export async function getPaquetesEvento(eventoId: string) { const r = await apiClient.get(`/Eventos/${eventoId}/paquetes`); return sanitizeSensitiveData(asArray<PaqueteEvento>(r.data)); }
export async function createPaqueteEvento(eventoId: string, payload: CrearPaqueteEventoRequest) { const r = await apiClient.post(`/Eventos/${eventoId}/paquetes`, payload); return sanitizeSensitiveData(r.data); }
export async function updatePaqueteEvento(paqueteId: string, payload: CrearPaqueteEventoRequest) { const r = await apiClient.put(`/Eventos/paquetes/${paqueteId}`, payload); return sanitizeSensitiveData(r.data); }
export async function deletePaqueteEvento(paqueteId: string) { const r = await apiClient.delete(`/Eventos/paquetes/${paqueteId}`); return sanitizeSensitiveData(r.data); }
