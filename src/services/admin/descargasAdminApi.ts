import type { Descarga } from '@/types/descarga'; import { adminGetList, adminGetOne, adminPost } from './adminHttp';
export const getDescargasAdmin = () => adminGetList<Descarga>('/Descargas/admin');
export const getDescargaAdmin = (id: string) => adminGetOne<Descarga>(`/Descargas/${id}`);
export const regenerarDescargaAdmin = (id: string) => adminPost(`/Descargas/${id}/regenerar`);
