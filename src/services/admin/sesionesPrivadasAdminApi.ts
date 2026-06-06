import type { SesionPrivada } from '@/types/sesionPrivada'; import { adminGetList, adminPut } from './adminHttp';
export const getSesionesPrivadasAdmin = () => adminGetList<SesionPrivada>('/SesionesPrivadas');
export const cambiarEstadoSesionPrivadaAdmin = (id: string, estado: string) => adminPut(`/SesionesPrivadas/${id}/estado`, { estado });
