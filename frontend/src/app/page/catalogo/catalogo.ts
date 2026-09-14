import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../navbar/navbar';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';

@Component({
  imports: [RouterLink, Navbar],
  selector: 'app-catalogo',
  styleUrl: './catalogo.css',
  templateUrl: './catalogo.html',
})
export class Catalogo implements OnInit{
  productos = signal <Producto[]>([]);
  constructor (private productoService: ProductoService){}
  ngOnInit(): void{
    this.productoService.obtenerProductos().subscribe({
      next: (datos) =>{
        this.productos.set(datos);
      },
      error:(error) =>{
        console.error('Error al cargar la baase de datos',error);
      }
    })
  }
}