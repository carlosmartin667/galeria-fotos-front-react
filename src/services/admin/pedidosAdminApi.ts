import type { Pedido } from '@/types/pedido'; import { adminGetList, adminGetOne, adminPut } from './adminHttp';
export const getPedidosAdmin = () => adminGetList<Pedido>('/Pedidos');
export const getPedidoAdmin = (id: string) => adminGetOne<Pedido>(`/Pedidos/${id}`);
export const getPedidoHistorialEstadosAdmin = (id: string) => adminGetList<Record<string, unknown>>(`/Pedidos/${id}/historial-estados`);
export const cambiarEstadoPedidoAdmin = (id: string, estado: string) => adminPut(`/Pedidos/${id}/estado`, { estado });
