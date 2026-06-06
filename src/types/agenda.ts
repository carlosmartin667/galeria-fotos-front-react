export interface DisponibilidadRequest {
  desde: string;
  hasta: string;
}

export interface DisponibilidadItem {
  fecha?: string;
  fechaInicioUtc?: string;
  fechaFinUtc?: string;
  disponible?: boolean;
  estado?: string;
  tipo?: string;
}
