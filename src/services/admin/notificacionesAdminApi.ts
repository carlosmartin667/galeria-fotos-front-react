import type { Notificacion } from '@/types/notificacion'; import { adminGetList, adminGetOne, adminPatch, adminPost, adminPut } from './adminHttp';
export const getNotificacionesAdmin = () => adminGetList<Notificacion>('/Notificaciones/admin');
export const getNotificacionAdmin = (id: string) => adminGetOne<Notificacion>(`/Notificaciones/admin/${id}`);
export const reenviarNotificacionAdmin = (id: string) => adminPost(`/Notificaciones/admin/${id}/reenviar`);
export const cancelarNotificacionAdmin = (id: string) => adminPatch(`/Notificaciones/admin/${id}/cancelar`);
export const getPlantillasAdmin = () => adminGetList<Record<string, unknown>>('/Notificaciones/plantillas');
export const updatePlantillaAdmin = (id: string, payload: unknown) => adminPut(`/Notificaciones/plantillas/${id}`, payload);
export const activarPlantillaAdmin = (id: string) => adminPatch(`/Notificaciones/plantillas/${id}/activar`);
