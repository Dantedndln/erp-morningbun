import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empleado, Pago } from '../models/empleado.model';

@Injectable({
  providedIn: 'root'// disponible en toda la app sin declararlo en cada componente
})
export class EmpleadoService {
  // Dirección base de la API de recursos humanos
  private api = 'http://localhost:3000/api/empleados';

  constructor(private http: HttpClient) {}

  // Cada método hace una petición GET a su endpoint correspondiente
  // y devuelve un Observable al que el componente se suscribe

  obtenerEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(this.api);
  }

  obtenerPagos(): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.api}/pagos`);
  }
}