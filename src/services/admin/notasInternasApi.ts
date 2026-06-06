import { adminDelete, adminGetList, adminPost, adminPut } from './adminHttp';
import type { ActualizarNotaInternaRequest, CrearNotaInternaRequest, NotaInterna } from '@/types/notaInterna';

export const getNotasInternasAdmin = (entidadTipo: string, entidadId: string) =>
  adminGetList<NotaInterna>(`/NotasInternas/${encodeURIComponent(entidadTipo)}/${entidadId}`);

export const createNotaInternaAdmin = (entidadTipo: string, entidadId: string, payload: CrearNotaInternaRequest) =>
  adminPost(`/NotasInternas/${encodeURIComponent(entidadTipo)}/${entidadId}`, payload);

export const updateNotaInternaAdmin = (id: string, payload: ActualizarNotaInternaRequest) =>
  adminPut(`/NotasInternas/${id}`, payload);

export const deleteNotaInternaAdmin = (id: string) => adminDelete(`/NotasInternas/${id}`);
