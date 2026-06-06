import { adminGetList, adminGetOne } from './adminHttp';
export const getOperacionesResumen = () => adminGetOne<Record<string, unknown>>('/Admin/operaciones/resumen');
export const getOperacionesPendientes = () => adminGetList<Record<string, unknown>>('/Admin/operaciones/pendientes');
