import type { Promocion } from '@/types/promocion'; import { adminGetList, adminPost, adminPut } from './adminHttp';
export const getPromocionesAdmin = () => adminGetList<Promocion>('/Promociones/admin');
export const createPromocionAdmin = (payload: Partial<Promocion>) => adminPost('/Promociones', payload);
export const updatePromocionAdmin = (id: string, payload: Partial<Promocion>) => adminPut(`/Promociones/${id}`, payload);
export const activarPromocionAdmin = (id: string) => adminPost(`/Promociones/${id}/activar`);
