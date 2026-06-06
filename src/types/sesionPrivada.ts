export interface SesionPrivada {
  id: string;
  clienteId?: string;
  clienteNombre?: string;
  titulo?: string;
  descripcion?: string | null;
  fechaSesionUtc?: string;
  estado?: string;
  precioPaquete?: number | null;
  activa?: boolean;
}

export interface CrearSesionPrivadaRequest {
  clienteId: string;
  titulo: string;
  descripcion?: string | null;
  fechaSesionUtc: string;
  estado?: string | null;
  precioPaquete?: number | null;
}

export interface ActualizarSesionPrivadaRequest {
  titulo: string;
  descripcion?: string | null;
  fechaSesionUtc: string;
  estado?: string | null;
  precioPaquete?: number | null;
  activa?: boolean;
}

export interface CambiarEstadoSesionPrivadaRequest {
  estado: string;
  comentario?: string | null;
}

export interface FotoPrivada {
  id: string;
  sesionPrivadaId?: string;
  nombreArchivo?: string;
  previewUrl?: string | null;
  precioUnitario?: number;
  activa?: boolean;
  storageKey?: string;
  marcaAguaStorageKey?: string | null;
  signedUrl?: string;
}

export interface GenerarStorageKeyFotoPrivadaRequest {
  nombreArchivo: string;
}

export interface CrearFotoPrivadaMetadataRequest {
  nombreArchivo: string;
  contentType: string;
  storageKey: string;
  previewUrl?: string | null;
  marcaAguaStorageKey?: string | null;
  sizeInBytes?: number;
  width?: number | null;
  height?: number | null;
  precioUnitario?: number;
}

export interface ActualizarFotoPrivadaRequest {
  nombreArchivo: string;
  previewUrl?: string | null;
  marcaAguaStorageKey?: string | null;
  precioUnitario?: number;
  activa?: boolean;
}
