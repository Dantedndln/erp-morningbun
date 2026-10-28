export interface Venta {
  id: number;
  cliente: string;
  registradoPor: string;
  fecha: string;
  total: number;
  metodoPago: string;
}

export interface DetalleVenta {
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface VentaCompleta extends Venta {
  correo: string;
  detalles: DetalleVenta[];
}