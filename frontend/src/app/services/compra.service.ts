import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compra, CompraCompleta, RenglonCompra } from '../models/compra.model';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private api = 'http://localhost:3000/api/compras';

  constructor(private http: HttpClient) {}

  obtenerCompras(): Observable<Compra[]> {
    return this.http.get<Compra[]>(this.api);
  }

  obtenerDetalle(id: number): Observable<CompraCompleta> {
    return this.http.get<CompraCompleta>(`${this.api}/${id}`);
  }

  registrarCompra(proveedorId: number, fecha: string, renglones: RenglonCompra[]): Observable<any> {
    return this.http.post(this.api, { proveedorId, fecha, renglones });
  }
}