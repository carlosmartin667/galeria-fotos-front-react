export interface CarritoItem { id: string; nombre?: string; descripcion?: string; cantidad?: number; precioUnitario?: number; subtotal?: number; fotoId?: string; paqueteId?: string; }
export interface Carrito { items?: CarritoItem[]; subtotal?: number; descuento?: number; total?: number; cuponCodigo?: string; }
