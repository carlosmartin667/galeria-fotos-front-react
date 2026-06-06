import type { Evento } from '@/types/evento'; import { adminGetList, adminGetOne, adminPost, adminPut } from './adminHttp';
export const getEventosAdmin = () => adminGetList<Evento>('/Eventos');
export const getEventoAdmin = (id: string) => adminGetOne<Evento>(`/Eventos/${id}`);
export const createEventoAdmin = (payload: Partial<Evento>) => adminPost('/Eventos', payload);
export const updateEventoAdmin = (id: string, payload: Partial<Evento>) => adminPut(`/Eventos/${id}`, payload);
export const setEventoPortada = (eventoId: string, fotoId: string) => adminPut(`/Eventos/${eventoId}/portada/${fotoId}`);
