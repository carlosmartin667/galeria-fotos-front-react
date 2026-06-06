import { apiClient } from '@/services/api/apiClient';
import { sanitizeSensitiveData } from '@/shared/utils/sensitiveText';

export interface BitacoraFilters {
  desde?: string;
  hasta?: string;
  usuarioId?: string;
  usuarioEmail?: string;
  accion?: string;
  entidadTipo?: string;
  entidadId?: string;
  severidad?: string;
  correlationId?: string;
  page?: number;
  pageSize?: number;
}

export async function getBitacora(filters: BitacoraFilters) {
  const response = await apiClient.get('/Bitacora', {
    params: {
      Desde: filters.desde || undefined,
      Hasta: filters.hasta || undefined,
      UsuarioId: filters.usuarioId || undefined,
      UsuarioEmail: filters.usuarioEmail || undefined,
      Accion: filters.accion || undefined,
      EntidadTipo: filters.entidadTipo || undefined,
      EntidadId: filters.entidadId || undefined,
      Severidad: filters.severidad || undefined,
      CorrelationId: filters.correlationId || undefined,
      Page: filters.page ?? 1,
      PageSize: filters.pageSize ?? 20,
    },
  });
  return sanitizeSensitiveData(response.data);
}

export async function getBitacoraResumen() {
  const response = await apiClient.get('/Bitacora/resumen');
  return sanitizeSensitiveData(response.data);
}
