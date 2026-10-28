//como llega desde el backend
export interface Compra {
  id: number;
  proveedor: string;
  fecha: string;
  total: number;
}

//un renglón de la compra que se está capturando
export interface RenglonCompra {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  costoUnitario: number;
  subtotal: number;
}

export interface DetalleCompra {
  nombre_producto: string;
  cantidad: number;
  costo_unitario: number;
  subtotal: number;
}

export interface CompraCompleta extends Compra {
  detalles: DetalleCompra[];
}