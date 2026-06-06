export interface Promocion {
  id: string;
  titulo: string;
  descripcion?: string;
  imagenUrl?: string;
  tipo?: string;
  fechaInicioUtc?: string;
  fechaFinUtc?: string;
  destacada?: boolean;
}
