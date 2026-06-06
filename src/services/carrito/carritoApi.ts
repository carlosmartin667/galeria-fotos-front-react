import { apiClient } from '@/services/api/apiClient';
import { unwrapData } from '@/shared/utils/apiData';
import { sanitizeSensitiveData } from '@/shared/utils/sensitiveText';
import type { Carrito } from '@/types/carrito';
export async function getCarrito() { const r = await apiClient.get('/Carrito'); return sanitizeSensitiveData(unwrapData<Carrito>(r.data, { items: [] })); }
export async function addFotoCarrito(fotoId: string) { const r = await apiClient.post(`/Carrito/items/foto-evento/${fotoId}`); return r.data; }
export async function removeCarritoItem(itemId: string) { const r = await apiClient.delete(`/Carrito/items/${itemId}`); return r.data; }
export async function applyCupon(codigo: string) { const r = await apiClient.post('/Carrito/cupon', { codigo }); return r.data; }
export async function removeCupon() { const r = await apiClient.delete('/Carrito/cupon'); return r.data; }
export async function createPedidoFromCarrito() { const r = await apiClient.post('/Carrito/crear-pedido'); return r.data; }
