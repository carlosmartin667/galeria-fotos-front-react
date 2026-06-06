import { apiClient } from '@/services/api/apiClient';
import { asArray } from '@/shared/utils/apiData';
import { sanitizeSensitiveData } from '@/shared/utils/sensitiveText';
import type { HistorialItem } from '@/types/historial';
export async function getMiHistorial() { const r = await apiClient.get('/Clientes/mi-historial'); return sanitizeSensitiveData(asArray<HistorialItem>(r.data)); }
