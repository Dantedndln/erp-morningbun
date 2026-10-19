import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-terminos',
  imports: [],
  templateUrl: './terminos.html',
  styleUrl: './terminos.css'
})
export class Terminos {
  constructor(private location: Location) {}

  regresar(): void {
    this.location.back();
  }
}