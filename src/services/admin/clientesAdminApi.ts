import type { Cliente } from '@/types/cliente'; import { adminGetList, adminGetOne, adminPost, adminPut } from './adminHttp';
export const getClientesAdmin = () => adminGetList<Cliente>('/Clientes');
export const getClienteAdmin = (id: string) => adminGetOne<Cliente>(`/Clientes/${id}`);
export const createClienteAdmin = (payload: Partial<Cliente>) => adminPost('/Clientes', payload);
export const updateClienteAdmin = (id: string, payload: Partial<Cliente>) => adminPut(`/Clientes/${id}`, payload);
export const getClienteHistorialAdmin = (id: string) => adminGetList<Record<string, unknown>>(`/Clientes/${id}/historial`);
