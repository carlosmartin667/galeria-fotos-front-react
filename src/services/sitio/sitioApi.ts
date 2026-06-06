import { apiClient } from '@/services/api/apiClient';
import { unwrapData } from '@/shared/utils/apiData';
import { sanitizeSensitiveData } from '@/shared/utils/sensitiveText';
import type { ActualizarPerfilFotografaRequest, PerfilPublicoAdmin } from '@/types/perfil';
import type { SitioContacto, SitioHome } from '@/types/sitio';

export async function getSitioHome() {
  const response = await apiClient.get('/Sitio/home');
  return sanitizeSensitiveData(unwrapData<SitioHome>(response.data, {}));
}

export async function getSitioContacto() {
  const response = await apiClient.get('/Sitio/contacto');
  return sanitizeSensitiveData(unwrapData<SitioContacto>(response.data, {}));
}

export async function getPerfilPublicoAdmin() {
  const response = await apiClient.get('/Admin/perfil-publico');
  return sanitizeSensitiveData(unwrapData<PerfilPublicoAdmin>(response.data, {}));
}

export async function getPerfilFotografaPublico() {
  const response = await apiClient.get('/Sitio/perfil-fotografa');
  return sanitizeSensitiveData(unwrapData<PerfilPublicoAdmin>(response.data, {}));
}

export async function getPerfilFotografaAdmin() {
  const response = await apiClient.get('/Sitio/perfil-fotografa/admin');
  return sanitizeSensitiveData(unwrapData<PerfilPublicoAdmin>(response.data, {}));
}

export async function updatePerfilFotografaAdmin(payload: ActualizarPerfilFotografaRequest) {
  const response = await apiClient.put('/Sitio/perfil-fotografa', payload);
  return sanitizeSensitiveData(response.data);
}
