import type { ReporteVentas } from '@/types/reporteVentas'; import { adminGetOne } from './adminHttp';
export const getReporteVentasAdmin = () => adminGetOne<ReporteVentas>('/Reportes/ventas');
