import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta, VentaCompleta } from '../models/venta.model';
import { ProductoCarrito } from '../models/paypal.model';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private api = 'http://localhost:3000/api/ventas';

  constructor(private http: HttpClient) {}
  //pide el historial de las ventas al backend y devuelve un Observable al que el componente se suscribe
  obtenerVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.api);
  }

  obtenerDetalle(id: number): Observable<VentaCompleta> {
    return this.http.get<VentaCompleta>(`${this.api}/${id}`);
  }

  // Venta de mostrador, cobrada en efectivo
  registrarVenta(
    clienteNombre: string,
    correoCliente: string,
    productos: ProductoCarrito[]
  ): Observable<any> {
    return this.http.post(this.api, { clienteNombre, correoCliente, productos });
  }
}