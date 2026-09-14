// Una venta tal como llega desde el backend
export interface Venta {
  id: number;
  cliente: string;
  registradoPor: string;
  fecha: string;
  total: number;
}