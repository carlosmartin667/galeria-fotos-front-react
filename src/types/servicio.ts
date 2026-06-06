export interface ServicioFotografia {
  id: string;
  nombre: string;
  descripcion?: string;
  precioDesde?: number;
  duracionEstimada?: string;
  cantidadFotosIncluidas?: number;
  imagenUrl?: string;
  destacado?: boolean;
}
