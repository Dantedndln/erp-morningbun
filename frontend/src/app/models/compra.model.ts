//Esto es una compra tal como llega desde el backend
export interface Compra {
  id: number;
  proveedor: string;
  fecha: string;
  total: number;
}