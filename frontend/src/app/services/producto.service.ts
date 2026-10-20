import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({
    providedIn: 'root'
})
export class ProductoService {
    private api = 'http://localhost:3000/api/productos';
    constructor (private http: HttpClient){}
    obtenerProductos(categoria: string = ''): Observable<Producto[]> {
    // El filtrado se realiza en el servidor
    const url = categoria ? `${this.api}?categoria=${categoria}` : this.api;
     return this.http.get<Producto[]>(url);
    }
}