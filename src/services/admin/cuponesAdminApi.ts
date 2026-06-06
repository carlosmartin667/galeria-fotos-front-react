import type { Cupon } from '@/types/cupon'; import { adminGetList, adminPost, adminPut } from './adminHttp';
export const getCuponesAdmin = () => adminGetList<Cupon>('/Cupones/admin');
export const createCuponAdmin = (payload: Partial<Cupon>) => adminPost('/Cupones', payload);
export const updateCuponAdmin = (id: string, payload: Partial<Cupon>) => adminPut(`/Cupones/${id}`, payload);
export const activarCuponAdmin = (id: string) => adminPost(`/Cupones/${id}/activar`);
export const desactivarCuponAdmin = (id: string) => adminPost(`/Cupones/${id}/desactivar`);
