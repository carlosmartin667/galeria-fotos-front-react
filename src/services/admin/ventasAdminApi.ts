import type { VentaResumen } from '@/types/venta'; import { adminGetOne } from './adminHttp';
export const getVentasResumenAdmin = () => adminGetOne<VentaResumen>('/Admin/ventas/resumen');
