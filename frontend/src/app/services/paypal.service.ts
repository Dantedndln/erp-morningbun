import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductoCarrito, OrdenPayPal, ResultadoPago } from '../models/paypal.model';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {
  private api = 'http://localhost:3000/api/paypal';

  constructor(private http: HttpClient) {}

  // envía los productos al backend, que calcula el total y crea la orden
  crearOrden(
    productos: ProductoCarrito[],
    clienteNombre: string,
    correoCliente: string
  ): Observable<OrdenPayPal> {
    return this.http.post<OrdenPayPal>(`${this.api}/orden`, {
      productos,
      clienteNombre,
      correoCliente
    });
  }

  // solicita la captura de una orden ya aprobada por el comprador
  capturarOrden(orderId: string): Observable<ResultadoPago> {
    return this.http.post<ResultadoPago>(`${this.api}/capturar/${orderId}`, {});
  }
}