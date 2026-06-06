import { apiClient } from '@/services/api/apiClient';
import { asArray } from '@/shared/utils/apiData';
import { sanitizeSensitiveData } from '@/shared/utils/sensitiveText';
import type { DisponibilidadItem, DisponibilidadRequest } from '@/types/agenda';

export async function getDisponibilidad(params: DisponibilidadRequest) {
  const response = await apiClient.get('/Agenda/disponibilidad', {
    params,
  });
  return sanitizeSensitiveData(asArray<DisponibilidadItem>(response.data));
}
