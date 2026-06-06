export interface PerfilCliente { email: string; nombre?: string; roles?: string[]; telefono?: string; }

export interface PerfilPublicoAdmin {
  nombre?: string;
  titulo?: string;
  descripcion?: string;
  biografia?: string;
  whatsApp?: string;
  instagram?: string;
  facebook?: string;
  tikTok?: string;
  sitioWeb?: string;
  correoPublico?: string;
  direccion?: string;
  ciudad?: string;
  provincia?: string;
  pais?: string;
  fotoPerfilUrl?: string;
  logoUrl?: string;
  bannerUrl?: string;
  textoBienvenida?: string;
  activa?: boolean;
}

export interface AdminMiPerfil {
  nombre?: string;
  descripcion?: string | null;
  whatsApp?: string | null;
  instagram?: string | null;
  correoPublico?: string | null;
  direccion?: string | null;
  email?: string;
  roles?: string[];
}

export interface ActualizarAdminPerfilRequest {
  nombre: string;
  descripcion?: string | null;
  whatsApp?: string | null;
  instagram?: string | null;
  correoPublico?: string | null;
  direccion?: string | null;
}

export type ActualizarPerfilFotografaRequest = PerfilPublicoAdmin;
