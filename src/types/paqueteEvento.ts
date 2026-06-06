export interface PaqueteEvento {
  id: string;
  eventoId?: string;
  nombre: string;
  descripcion?: string | null;
  precio?: number;
  incluyeTodasLasFotos?: boolean;
  activo?: boolean;
  destacado?: boolean;
  ordenDestacado?: number | null;
}

export interface CrearPaqueteEventoRequest {
  nombre: string;
  descripcion?: string | null;
  precio?: number;
  incluyeTodasLasFotos?: boolean;
  activo?: boolean;
  destacado?: boolean;
  ordenDestacado?: number | null;
}

export type ActualizarPaqueteEventoRequest = CrearPaqueteEventoRequest;
