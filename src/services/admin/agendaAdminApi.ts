import { apiClient } from '@/services/api/apiClient';
import { asArray } from '@/shared/utils/apiData';
import { sanitizeSensitiveData } from '@/shared/utils/sensitiveText';
import { adminDelete, adminPost, adminPut } from './adminHttp';

export interface AgendaAdminFilters {
  desde?: string;
  hasta?: string;
  tipo?: string;
  estado?: string;
  activo?: boolean;
}

export const getAgendaAdmin = async (filters: AgendaAdminFilters = {}) => {
  const response = await apiClient.get('/Agenda', {
    params: {
      Desde: filters.desde || undefined,
      Hasta: filters.hasta || undefined,
      Tipo: filters.tipo || undefined,
      Estado: filters.estado || undefined,
      Activo: filters.activo,
    },
  });
  return sanitizeSensitiveData(asArray<Record<string, unknown>>(response.data));
};
export const createAgendaAdmin = (payload: unknown) => adminPost('/Agenda', payload);
export const updateAgendaAdmin = (id: string, payload: unknown) => adminPut(`/Agenda/${id}`, payload);
export const deleteAgendaAdmin = (id: string) => adminDelete(`/Agenda/${id}`);
