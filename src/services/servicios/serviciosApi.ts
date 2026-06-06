import { apiClient } from '@/services/api/apiClient';
import { asArray, unwrapData } from '@/shared/utils/apiData';
import { sanitizeSensitiveData } from '@/shared/utils/sensitiveText';
import type { ServicioFotografia } from '@/types/servicio';

export async function getServicios() {
  const response = await apiClient.get('/Servicios');
  return sanitizeSensitiveData(asArray<ServicioFotografia>(response.data));
}

export async function getServicio(id: string) {
  const response = await apiClient.get(`/Servicios/${id}`);
  return sanitizeSensitiveData(unwrapData<ServicioFotografia | null>(response.data, null));
}
