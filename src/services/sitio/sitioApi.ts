import { apiClient } from '@/services/api/apiClient';
import { unwrapData } from '@/shared/utils/apiData';
import { sanitizeSensitiveData } from '@/shared/utils/sensitiveText';
import type { SitioContacto, SitioHome } from '@/types/sitio';

export async function getSitioHome() {
  const response = await apiClient.get('/Sitio/home');
  return sanitizeSensitiveData(unwrapData<SitioHome>(response.data, {}));
}

export async function getSitioContacto() {
  const response = await apiClient.get('/Sitio/contacto');
  return sanitizeSensitiveData(unwrapData<SitioContacto>(response.data, {}));
}
