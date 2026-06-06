import { adminGetOne, adminPut } from './adminHttp';
import type { ActualizarAdminPerfilRequest, AdminMiPerfil } from '@/types/perfil';

export const getMiPerfilAdmin = () => adminGetOne<AdminMiPerfil>('/Admin/mi-perfil');
export const updateMiPerfilAdmin = (payload: ActualizarAdminPerfilRequest) => adminPut('/Admin/mi-perfil', payload);
