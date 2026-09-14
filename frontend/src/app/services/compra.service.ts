import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compra } from '../models/compra.model';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private api = 'http://localhost:3000/api/compras';

  constructor(private http: HttpClient) {}

  obtenerCompras(): Observable<Compra[]> {
    return this.http.get<Compra[]>(this.api);
  }
}