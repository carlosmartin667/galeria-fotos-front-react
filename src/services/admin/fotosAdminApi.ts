import { apiClient } from '@/services/api/apiClient';
import { sanitizeSensitiveData } from '@/shared/utils/sensitiveText';
import type { ActualizarFotoRequest, CrearFotoMetadataBulkRequest, CrearFotoMetadataRequest, Foto, FotosPaginadasFilters, GenerarStorageKeyRequest, GenerarStorageKeysBulkRequest } from '@/types/foto';
import { adminGetList, adminGetOne, adminPost, adminPut } from './adminHttp';

export const getFotosEventoAdmin = (eventoId: string) => adminGetList<Foto>(`/Fotos/evento/${eventoId}`);
export const getFotosEventoPaginadoAdmin = async (eventoId: string, filters: FotosPaginadasFilters = {}) => {
  const response = await apiClient.get(`/Fotos/evento/${eventoId}/paginado`, {
    params: { Page: filters.page, PageSize: filters.pageSize, All: filters.all },
  });
  return sanitizeSensitiveData(response.data as Record<string, unknown>);
};
export const getFotoAdmin = (id: string) => adminGetOne<Foto>(`/Fotos/${id}`);
export const updateFotoMetadataAdmin = (id: string, payload: ActualizarFotoRequest) => adminPut(`/Fotos/${id}`, payload);
export const createStorageKeyAdmin = (payload: GenerarStorageKeyRequest) => adminPost('/Fotos/storage-key', payload);
export const createFotoMetadataAdmin = (payload: CrearFotoMetadataRequest) => adminPost('/Fotos/metadata', payload);
export const createFotoMetadataBulkAdmin = (payload: CrearFotoMetadataBulkRequest) => adminPost('/Fotos/metadata/bulk', payload);
export const createStorageKeysBulkAdmin = (payload: GenerarStorageKeysBulkRequest) => adminPost('/Fotos/storage-keys/bulk', payload);
