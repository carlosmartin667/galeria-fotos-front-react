import { apiClient } from '@/services/api/apiClient';
import { asArray, unwrapData } from '@/shared/utils/apiData';
import { sanitizeSensitiveData } from '@/shared/utils/sensitiveText';
import type { Pedido } from '@/types/pedido';
export async function getPedidos() { const r = await apiClient.get('/Pedidos'); return sanitizeSensitiveData(asArray<Pedido>(r.data)); }
export async function getPedido(id: string) { const r = await apiClient.get(`/Pedidos/${id}`); return sanitizeSensitiveData(unwrapData<Pedido | null>(r.data, null)); }
