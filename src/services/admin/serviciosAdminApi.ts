import type { ServicioFotografia } from '@/types/servicio'; import { adminGetList, adminPost, adminPut } from './adminHttp';
export const getServiciosAdmin = () => adminGetList<ServicioFotografia>('/Servicios/admin');
export const createServicioAdmin = (payload: Partial<ServicioFotografia>) => adminPost('/Servicios', payload);
export const updateServicioAdmin = (id: string, payload: Partial<ServicioFotografia>) => adminPut(`/Servicios/${id}`, payload);
