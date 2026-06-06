import { apiClient } from '@/services/api/apiClient';
import type { SolicitudPresupuestoRequest } from '@/types/presupuesto';

export async function createSolicitudPresupuesto(payload: SolicitudPresupuestoRequest) {
  const response = await apiClient.post('/Presupuestos/solicitudes', payload);
  return response.data;
}
