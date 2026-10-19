// Un movimiento del registro general
export interface Movimiento {
  fecha: string;
  tipo: string;// 'Ingreso' o 'Egreso'
  origen: string;// 'Venta', 'Compra' o 'Pago'
  referencia: string;// folio de la venta/compra o nombre del empleado
  monto: number;
}

// totales del periodo
export interface Resumen {
  ingresos: number;
  egresos: number;
  balance: number;
}