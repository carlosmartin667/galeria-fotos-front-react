import { adminDelete, adminGetList, adminPost, adminPut } from './adminHttp';
export const getAgendaAdmin = () => adminGetList<Record<string, unknown>>('/Agenda');
export const createAgendaAdmin = (payload: unknown) => adminPost('/Agenda', payload);
export const updateAgendaAdmin = (id: string, payload: unknown) => adminPut(`/Agenda/${id}`, payload);
export const deleteAgendaAdmin = (id: string) => adminDelete(`/Agenda/${id}`);
