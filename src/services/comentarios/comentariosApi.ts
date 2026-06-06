import { apiClient } from '@/services/api/apiClient';
import { asArray } from '@/shared/utils/apiData';
import { sanitizeSensitiveData } from '@/shared/utils/sensitiveText';
import type { Comentario, ComentarioRequest } from '@/types/comentario';

export async function getComentariosEvento(eventoId: string) {
  const response = await apiClient.get(`/Eventos/${eventoId}/comentarios`);
  return sanitizeSensitiveData(asArray<Comentario>(response.data));
}

export async function createComentarioEvento(eventoId: string, payload: ComentarioRequest) {
  const response = await apiClient.post(`/Eventos/${eventoId}/comentarios`, payload);
  return sanitizeSensitiveData(response.data);
}

export async function updateComentarioEvento(comentarioId: string, payload: ComentarioRequest) {
  const response = await apiClient.put(`/Eventos/comentarios/${comentarioId}`, payload);
  return sanitizeSensitiveData(response.data);
}

export async function deleteComentarioEvento(comentarioId: string) {
  const response = await apiClient.delete(`/Eventos/comentarios/${comentarioId}`);
  return sanitizeSensitiveData(response.data);
}

export async function getComentariosFoto(fotoId: string) {
  const response = await apiClient.get(`/Fotos/${fotoId}/comentarios`);
  return sanitizeSensitiveData(asArray<Comentario>(response.data));
}

export async function createComentarioFoto(fotoId: string, payload: ComentarioRequest) {
  const response = await apiClient.post(`/Fotos/${fotoId}/comentarios`, payload);
  return sanitizeSensitiveData(response.data);
}

export async function updateComentarioFoto(comentarioId: string, payload: ComentarioRequest) {
  const response = await apiClient.put(`/Fotos/comentarios/${comentarioId}`, payload);
  return sanitizeSensitiveData(response.data);
}

export async function deleteComentarioFoto(comentarioId: string) {
  const response = await apiClient.delete(`/Fotos/comentarios/${comentarioId}`);
  return sanitizeSensitiveData(response.data);
}
