export interface Testimonio {
  id: string;
  nombreCliente: string;
  texto: string;
  calificacion?: number;
  imagenUrl?: string;
  destacado?: boolean;
}

export interface CrearTestimonioRequest {
  nombreCliente: string;
  emailCliente?: string;
  texto: string;
  calificacion: number;
}
