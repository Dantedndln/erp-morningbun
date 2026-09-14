import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta } from '../models/venta.model';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private api = 'http://localhost:3000/api/ventas';

  constructor(private http: HttpClient) {}

  // Pide el historial de ventas al backend
  obtenerVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.api);
  }
}