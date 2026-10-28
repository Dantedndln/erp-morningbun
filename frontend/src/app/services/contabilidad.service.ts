import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movimiento, Resumen, PuntoGrafica } from '../models/contabilidad.model';

@Injectable({
  providedIn: 'root'
})
export class ContabilidadService {
  private api = 'http://localhost:3000/api/contabilidad';

  //el rango viaja como parámetros de consulta y el filtrado lo realiza el servidor
  private rango(desde: string, hasta: string): string {
    return `?desde=${desde}&hasta=${hasta}`;
  }

  constructor(private http: HttpClient) {}

  obtenerMovimientos(desde: string, hasta: string): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(`${this.api}/movimientos${this.rango(desde, hasta)}`);
  }

  obtenerResumen(desde: string, hasta: string): Observable<Resumen> {
    return this.http.get<Resumen>(`${this.api}/resumen${this.rango(desde, hasta)}`);
  }

  obtenerGrafica(desde: string, hasta: string): Observable<PuntoGrafica[]> {
    return this.http.get<PuntoGrafica[]>(`${this.api}/grafica${this.rango(desde, hasta)}`);
  }
}