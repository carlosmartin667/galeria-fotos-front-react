import { apiClient } from '@/services/api/apiClient';
import { asArray, unwrapData } from '@/shared/utils/apiData';
import { sanitizeSensitiveData } from '@/shared/utils/sensitiveText';
import type { Promocion } from '@/types/promocion';

export async function getPromociones() {
  const response = await apiClient.get('/Promociones');
  return sanitizeSensitiveData(asArray<Promocion>(response.data));
}

export async function getPromocion(id: string) {
  const response = await apiClient.get(`/Promociones/${id}`);
  return sanitizeSensitiveData(unwrapData<Promocion | null>(response.data, null));
}
