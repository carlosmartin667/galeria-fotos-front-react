export interface Comentario {
  id: string;
  texto?: string;
  autorNombre?: string;
  autorEmail?: string;
  fechaCreacionUtc?: string;
  fechaActualizacionUtc?: string;
  activo?: boolean;
}

export interface ComentarioRequest {
  texto: string;
}
