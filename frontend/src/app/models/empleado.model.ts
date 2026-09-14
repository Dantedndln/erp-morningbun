// Un empleado tal como llega desde el backend
export interface Empleado {
  id: number;
  nombre: string;
  puesto: string;
  salario: number;
  telefono: string;
  imagen: string;
}

// Un registro de asistencia (ya viene con el nombre por el JOIN)
export interface Asistencia {
  id: number;
  nombre: string;
  puesto: string;
  fecha: string;
  asistio: number;   // 1 = asistió, 0 = no asistió
}

// Un pago realizado a un empleado
export interface Pago {
  id: number;
  nombre: string;
  puesto: string;
  fecha: string;
  dias_asistidos: number;
  monto: number;
}