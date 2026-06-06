import { apiClient } from '@/services/api/apiClient';
import { unwrapData } from '@/shared/utils/apiData';
import { sanitizeSensitiveData } from '@/shared/utils/sensitiveText';
import type { ReporteVentas, ReporteVentasFilters } from '@/types/reporteVentas';

export const getReporteVentasAdmin = async (filters: ReporteVentasFilters = {}) => {
  const response = await apiClient.get('/Reportes/ventas/resumen', {
    params: {
      desde: filters.desde || undefined,
      hasta: filters.hasta || undefined,
    },
  });
  return sanitizeSensitiveData(unwrapData<ReporteVentas>(response.data, {}));
};
