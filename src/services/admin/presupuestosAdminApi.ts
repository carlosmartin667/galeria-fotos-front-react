import type { SolicitudPresupuestoRequest } from '@/types/presupuesto'; import { adminGetList, adminGetOne, adminPost, adminPut } from './adminHttp';
export const getPresupuestosAdmin = () => adminGetList<Record<string, unknown>>('/Presupuestos/solicitudes');
export const getPresupuestoAdmin = (id: string) => adminGetOne<Record<string, unknown>>(`/Presupuestos/solicitudes/${id}`);
export const createPresupuestoAdmin = (payload: SolicitudPresupuestoRequest) => adminPost('/Presupuestos/solicitudes', payload);
export const updatePresupuestoEstadoAdmin = (id: string, estado: string) => adminPut(`/Presupuestos/solicitudes/${id}/estado`, { estado });
