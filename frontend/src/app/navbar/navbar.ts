import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CarritoService } from '../services/carrito.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  constructor(private authService: AuthService, private router: Router, private carritoService: CarritoService) {}

  // Borra las credenciales locales y regresa al login
  cerrarSesion(): void {
    this.carritoService.vaciar();
    this.authService.cerrarSesion();
    this.router.navigate(['/']);
  }
}