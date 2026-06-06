import { adminGetList, adminGetOne, adminPost } from './adminHttp';
export const getCarritosAbandonadosAdmin = () => adminGetList<Record<string, unknown>>('/Carritos/abandonados');
export const getCarritosAbandonadosResumenAdmin = () => adminGetOne<Record<string, unknown>>('/Carritos/abandonados/resumen');
export const detectarCarritosAbandonadosAdmin = () => adminPost('/Carritos/abandonados/detectar');
export const notificarCarritoAbandonadoAdmin = (id: string) => adminPost(`/Carritos/abandonados/${id}/notificar`);
