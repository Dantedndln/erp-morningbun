export interface Movimiento {
  fecha: string;
  tipo: string;//'Ingreso' o 'Egreso'
  origen: string;//'Venta', 'Compra' o 'Pago'
  referencia: string;
  monto: number;
}

//totales del periodo, coalesce devuelve cero cuando no hay registros
export interface Resumen {
  ingresos: number;
  egresos: number;
  balance: number;
}

//un punto de la gráfica, son los totales de un día
export interface PuntoGrafica {
  fecha: string;
  ingresos: number;
  egresos: number;
}