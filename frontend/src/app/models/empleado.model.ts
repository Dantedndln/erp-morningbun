// Un empleado tal como llega desde el backend
export interface Empleado {
  id: number;
  nombre: string;
  puesto: string;
  salario: number;
  telefono: string;
  imagen: string;
}


// Un pago realizado a un empleado
export interface Pago {
  id: number;
  nombre: string;
  puesto: string;
  fecha: string;
  dias_laborados: number;
  monto: number;
}