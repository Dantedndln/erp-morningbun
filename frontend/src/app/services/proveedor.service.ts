import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proveedor } from '../models/proveedor.model';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private api = 'http://localhost:3000/api/proveedores';

  constructor(private http: HttpClient) {}

  obtenerProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.api);
  }

  crearProveedor(proveedor: any): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.api, proveedor);
  }

  modificarProveedor(id: number, proveedor: any): Observable<Proveedor> {
    return this.http.put<Proveedor>(`${this.api}/${id}`, proveedor);
  }

  darDeBajaProveedor(id: number): Observable<any> {
    return this.http.patch(`${this.api}/${id}/baja`, {});
  }
}