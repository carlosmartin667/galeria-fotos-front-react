export interface SolicitudPresupuestoRequest {
  nombre: string;
  email: string;
  whatsApp?: string;
  tipoEvento?: string;
  servicioId?: string;
  fechaTentativaUtc?: string;
  lugar?: string;
  cantidadInvitados?: number;
  mensaje: string;
}
