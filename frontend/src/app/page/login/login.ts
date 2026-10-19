import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  error = signal('');

  constructor(private authService: AuthService, private router: Router) {}

  iniciarSesion(event: Event): void {
    event.preventDefault(); // evita que el formulario recargue la página :P
    this.error.set('');

    // FormData lee los valores del formulario a partir del atributo name
    const formulario = event.target as HTMLFormElement;
    const datos = new FormData(formulario);

    const usuario = {
      usuario: datos.get('usuario') as string,
      contrasena: datos.get('contrasena') as string
    };

    this.authService.login(usuario).subscribe({
      next: (respuesta) => {
        this.authService.guardarToken(
          respuesta.token,
          respuesta.rol,
          respuesta.nombre,
          respuesta.correo
        );

        // El sistema redirige según el rol asignado al autenticarse
        if (respuesta.rol === 'administrador') {
          this.router.navigate(['/contabilidad']);
        } else {
          this.router.navigate(['/catalogo']);
        }
      },
      error: (error) => {
        this.error.set(error.error?.mensaje || 'Usuario o contraseña incorrectos');
      }
    });
  }
}