import { apiClient } from '@/services/api/apiClient';
import { sanitizeSensitiveData } from '@/shared/utils/sensitiveText';

export interface BitacoraFilters {
  usuarioEmail?: string;
  accion?: string;
  severidad?: string;
}

export async function getBitacora(filters: BitacoraFilters) {
  const response = await apiClient.get('/Bitacora', {
    params: {
      UsuarioEmail: filters.usuarioEmail || undefined,
      Accion: filters.accion || undefined,
      Severidad: filters.severidad || undefined,
      Page: 1,
      PageSize: 20,
    },
  });
  return sanitizeSensitiveData(response.data);
}

export async function getBitacoraResumen() {
  const response = await apiClient.get('/Bitacora/resumen');
  return sanitizeSensitiveData(response.data);
}

export async function callDevTool(path: string) {
  const response = await apiClient.get(path);
  return sanitizeSensitiveData(response.data);
}
