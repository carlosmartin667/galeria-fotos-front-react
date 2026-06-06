import { apiClient } from '@/services/api/apiClient';
import { asArray } from '@/shared/utils/apiData';
import { sanitizeSensitiveData } from '@/shared/utils/sensitiveText';
import type { Notificacion } from '@/types/notificacion';
export async function getNotificaciones() { const r = await apiClient.get('/Notificaciones/mis-notificaciones'); return sanitizeSensitiveData(asArray<Notificacion>(r.data)); }
export async function markNotificacionRead(id: string) { const r = await apiClient.patch(`/Notificaciones/${id}/leer`); return r.data; }
export async function markAllNotificacionesRead() { const r = await apiClient.patch('/Notificaciones/marcar-todas-leidas'); return r.data; }
