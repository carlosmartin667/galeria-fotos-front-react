import type { ActualizarFotoPrivadaRequest, ActualizarSesionPrivadaRequest, CambiarEstadoSesionPrivadaRequest, CrearFotoPrivadaMetadataRequest, CrearSesionPrivadaRequest, FotoPrivada, GenerarStorageKeyFotoPrivadaRequest, SesionPrivada } from '@/types/sesionPrivada';
import { adminDelete, adminGetList, adminGetOne, adminPost, adminPut } from './adminHttp';

export const getSesionesPrivadasAdmin = () => adminGetList<SesionPrivada>('/SesionesPrivadas');
export const createSesionPrivadaAdmin = (payload: CrearSesionPrivadaRequest) => adminPost('/SesionesPrivadas', payload);
export const getSesionPrivadaAdmin = (id: string) => adminGetOne<SesionPrivada>(`/SesionesPrivadas/${id}`);
export const updateSesionPrivadaAdmin = (id: string, payload: ActualizarSesionPrivadaRequest) => adminPut(`/SesionesPrivadas/${id}`, payload);
export const deleteSesionPrivadaAdmin = (id: string) => adminDelete(`/SesionesPrivadas/${id}`);
export const cambiarEstadoSesionPrivadaAdmin = (id: string, estado: string, comentario?: string) => adminPut(`/SesionesPrivadas/${id}/estado`, { estado, comentario } satisfies CambiarEstadoSesionPrivadaRequest);
export const getFotosPrivadasAdmin = (id: string) => adminGetList<FotoPrivada>(`/SesionesPrivadas/${id}/fotos`);
export const createStorageKeyFotoPrivadaAdmin = (id: string, payload: GenerarStorageKeyFotoPrivadaRequest) => adminPost(`/SesionesPrivadas/${id}/fotos/storage-key`, payload);
export const createFotoPrivadaMetadataAdmin = (id: string, payload: CrearFotoPrivadaMetadataRequest) => adminPost(`/SesionesPrivadas/${id}/fotos/metadata`, payload);
export const updateFotoPrivadaAdmin = (fotoPrivadaId: string, payload: ActualizarFotoPrivadaRequest) => adminPut(`/SesionesPrivadas/fotos/${fotoPrivadaId}`, payload);
export const deleteFotoPrivadaAdmin = (fotoPrivadaId: string) => adminDelete(`/SesionesPrivadas/fotos/${fotoPrivadaId}`);
