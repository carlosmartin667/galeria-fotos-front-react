export interface CrearPreferenciaPagoRequest {
  pedidoId: string;
}

export interface PreferenciaPago {
  id?: string;
  preferenceId?: string;
  initPoint?: string;
  init_point?: string;
  sandboxInitPoint?: string;
  sandbox_init_point?: string;
  url?: string;
}
