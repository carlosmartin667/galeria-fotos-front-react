import { apiClient } from '@/services/api/apiClient';
import { asArray } from '@/shared/utils/apiData';
import { sanitizeSensitiveData } from '@/shared/utils/sensitiveText';
import type { CrearTestimonioRequest, Testimonio } from '@/types/testimonio';

export async function getTestimonios() {
  const response = await apiClient.get('/Testimonios');
  return sanitizeSensitiveData(asArray<Testimonio>(response.data));
}

export async function getTestimoniosDestacados() {
  const response = await apiClient.get('/Testimonios/destacados');
  return sanitizeSensitiveData(asArray<Testimonio>(response.data));
}

export async function createTestimonio(payload: CrearTestimonioRequest) {
  const response = await apiClient.post('/Testimonios', payload);
  return response.data;
}
