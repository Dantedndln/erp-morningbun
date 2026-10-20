// Lo que se envía al backend es solo el identificador y la cantidad
// Los precios los consulta el servidor en la base de datos
export interface ProductoCarrito {
  id: number;
  cantidad: number;
}

// Respuesta al crear la orden
export interface OrdenPayPal {
  id: string;
  total: string;
}

// Respuesta al capturar el pago
export interface ResultadoPago {
  mensaje: string;
  ventaId: number;
  orderId: string;
  capturaId: string;
  total: string;
}