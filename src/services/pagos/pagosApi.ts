import { apiClient } from '@/services/api/apiClient';
import { unwrapData } from '@/shared/utils/apiData';
import { sanitizeSensitiveData } from '@/shared/utils/sensitiveText';
import type { CrearPreferenciaPagoRequest, PreferenciaPago } from '@/types/pago';

export async function crearPreferenciaCheckoutPro(payload: CrearPreferenciaPagoRequest) {
  const response = await apiClient.post('/Pagos/checkout-pro/preferencias', payload);
  return sanitizeSensitiveData(unwrapData<PreferenciaPago>(response.data, {}));
}

export function getCheckoutUrl(preferencia: PreferenciaPago) {
  return preferencia.initPoint ?? preferencia.init_point ?? preferencia.sandboxInitPoint ?? preferencia.sandbox_init_point ?? preferencia.url ?? '';
}
