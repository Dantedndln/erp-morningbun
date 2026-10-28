import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private api = 'http://localhost:3000/api/productos';

  constructor(private http: HttpClient) {}

  // El filtrado por categoría se realiza en el servidor
  obtenerProductos(categoria: string = ''): Observable<Producto[]> {
    const url = categoria ? `${this.api}?categoria=${categoria}` : this.api;
    return this.http.get<Producto[]>(url);
  }

  crearProducto(producto: any): Observable<Producto> {
    return this.http.post<Producto>(this.api, producto);
  }

  // Modificar genera un registro nuevo y da de baja el anterior
  modificarProducto(id: number, producto: any): Observable<Producto> {
    return this.http.put<Producto>(`${this.api}/${id}`, producto);
  }

  // El registro permanece en la base de datos
  darDeBajaProducto(id: number): Observable<any> {
    return this.http.patch(`${this.api}/${id}/baja`, {});
  }
}