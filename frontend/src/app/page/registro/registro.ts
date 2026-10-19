import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  imports: [RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  error = signal('');
  exito = signal('');

  constructor(private authService: AuthService, private router: Router) {}

  registrarse(event: Event): void {
    event.preventDefault();
    this.error.set('');

    const formulario = event.target as HTMLFormElement;
    const datos = new FormData(formulario);

    // Una casilla marcada devuelve 'on'; si no está marcada, devuelve null
    const aceptoTerminos = datos.get('terminos') === 'on';

    if (!aceptoTerminos) {
      this.error.set('Debes aceptar los términos y condiciones y el aviso de privacidad'); //Obligatorio, chat 
      return;
    }

    const cuenta = {
      nombre: datos.get('nombre') as string,
      usuario: datos.get('usuario') as string,
      correo: datos.get('correo') as string,
      contrasena: datos.get('contrasena') as string,
      confirmar: datos.get('confirmar') as string,
      aceptoTerminos: aceptoTerminos
    };

    this.authService.registro(cuenta).subscribe({
      next: () => {
        this.exito.set('Cuenta creada correctamente');
        setTimeout(() => this.router.navigate(['/']), 1500);
      },
      error: (error) => {
        this.error.set(error.error?.mensaje || 'No se pudo completar el registro');
      }
    });
  }
}