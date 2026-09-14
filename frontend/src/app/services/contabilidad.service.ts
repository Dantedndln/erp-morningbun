import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movimiento, Resumen } from '../models/contabilidad.model';

@Injectable({
  providedIn: 'root'
})
export class ContabilidadService {
  private api = 'http://localhost:3000/api/contabilidad';

  constructor(private http: HttpClient) {}

  obtenerMovimientos(): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(`${this.api}/movimientos`);
  }

  obtenerResumen(): Observable<Resumen> {
    return this.http.get<Resumen>(`${this.api}/resumen`);
  }
}