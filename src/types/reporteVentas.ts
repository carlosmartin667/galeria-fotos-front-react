export interface ReporteVentas { total?: number; cantidad?: number; desde?: string; hasta?: string; items?: Array<{ periodo?: string; total?: number; cantidad?: number }>; }

export interface ReporteVentasFilters {
  desde?: string;
  hasta?: string;
}
