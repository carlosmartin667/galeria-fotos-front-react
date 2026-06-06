export interface NotaInterna {
  id: string;
  entidadTipo?: string;
  entidadId?: string;
  texto?: string;
  autorNombre?: string;
  autorEmail?: string;
  fechaCreacionUtc?: string;
  fechaActualizacionUtc?: string;
  activa?: boolean;
}

export interface CrearNotaInternaRequest {
  texto: string;
}

export interface ActualizarNotaInternaRequest {
  texto: string;
  activa?: boolean;
}
