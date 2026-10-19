import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Credenciales, RespuestaLogin } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  // envía las credenciales al backend
  login(usuario: Credenciales): Observable<RespuestaLogin> {
    return this.http.post<RespuestaLogin>(`${this.url}/login`, usuario);
  }

  registro(datos: any): Observable<any> {
    return this.http.post(`${this.url}/registro`, datos);
  }

  guardarToken(token: string, rol: string, nombre: string, correo: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('rol', rol);
    localStorage.setItem('nombre', nombre);
    localStorage.setItem('correo', correo);
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  obtenerRol(): string | null {
    return localStorage.getItem('rol');
  }

  obtenerNombre(): string | null {
    return localStorage.getItem('nombre');
  }

  obtenerCorreo(): string | null {
    return localStorage.getItem('correo');
  }

  estaAutenticado(): boolean {
    return this.obtenerToken() !== null;
  }

  // al cerrar sesión se borran las credenciales para que el usuario no pueda regresar a las vistas protegidas
  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombre');
    localStorage.removeItem('correo');
  }

  // Comprueba si el rol guardado está entre los permitidos por la ruta
  tieneRol(rolesPermitidos: string[]): boolean {
    const rol = this.obtenerRol();
    return rol !== null && rolesPermitidos.includes(rol);
  }
}