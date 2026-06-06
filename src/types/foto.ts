export interface Foto {
  id: string;
  eventoId?: string;
  nombreArchivo?: string;
  titulo?: string;
  previewUrl?: string;
  precioUnitario?: number;
  destacada?: boolean;
  storageKey?: string;
  marcaAguaStorageKey?: string;
  signedUrl?: string;
}

export interface FotosPaginadasFilters {
  page?: number;
  pageSize?: number;
  all?: boolean;
}

export interface GenerarStorageKeyRequest {
  eventoId: string;
  nombreArchivo: string;
}

export interface GenerarStorageKeysBulkRequest {
  eventoId: string;
  nombresArchivo: string[];
}

export interface CrearFotoMetadataRequest {
  eventoId: string;
  nombreArchivo: string;
  contentType: string;
  storageKey: string;
  previewUrl?: string | null;
  marcaAguaStorageKey?: string | null;
  sizeInBytes?: number;
  width?: number | null;
  height?: number | null;
  precioUnitario?: number;
  tieneMarcaAgua?: boolean | null;
  procesada?: boolean | null;
  destacado?: boolean;
  ordenDestacado?: number | null;
}

export interface CrearFotoMetadataBulkRequest {
  fotos: CrearFotoMetadataRequest[];
}

export interface ActualizarFotoRequest {
  nombreArchivo: string;
  previewUrl?: string | null;
  precioUnitario?: number;
  destacada?: boolean;
  ordenDestacado?: number | null;
}
