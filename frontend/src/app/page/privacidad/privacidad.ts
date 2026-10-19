import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-privacidad',
  imports: [],
  templateUrl: './privacidad.html',
  styleUrl: './privacidad.css'
})
export class Privacidad {
  constructor(private location: Location) {}

  // regresa a la pantalla anterior, sea el registro o el catálogo o cualquier lugar desde donde se haya llegado a la página 
  // de privacidad
  regresar(): void {
    this.location.back();
  }
}