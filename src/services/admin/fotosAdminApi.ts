import type { Foto } from '@/types/foto'; import { adminGetList, adminGetOne, adminPost, adminPut } from './adminHttp';
export const getFotosAdmin = () => adminGetList<Foto>('/Fotos');
export const getFotosEventoAdmin = (eventoId: string) => adminGetList<Foto>(`/Fotos/evento/${eventoId}`);
export const getFotoAdmin = (id: string) => adminGetOne<Foto>(`/Fotos/${id}`);
export const updateFotoMetadataAdmin = (id: string, payload: Partial<Foto>) => adminPut(`/Fotos/${id}`, payload);
export const createFotoMetadataAdmin = (payload: unknown) => adminPost('/Fotos/metadata', payload);
export const createFotoMetadataBulkAdmin = (payload: unknown) => adminPost('/Fotos/metadata/bulk', payload);
export const createStorageKeysBulkAdmin = (payload: unknown) => adminPost('/Fotos/storage-keys/bulk', payload);
