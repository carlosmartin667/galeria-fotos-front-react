export interface PedidoItem { id: string; nombre?: string; cantidad?: number; precioUnitario?: number; subtotal?: number; }
export interface Pedido { id: string; numero?: string; estado?: string; subtotal?: number; descuento?: number; total?: number; cuponCodigo?: string; items?: PedidoItem[]; fechaCreacionUtc?: string; pagoUrl?: string; }
