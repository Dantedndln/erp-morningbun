import { Component, OnInit, signal } from '@angular/core';
import { Navbar } from '../../navbar/navbar';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';

@Component({
  imports: [Navbar],
  selector: 'app-inventario',
  styleUrl: './inventario.css',
  templateUrl: './inventario.html',
})
export class Inventario implements OnInit{
  productos = signal <Producto[]>([]);
  //signal se usa para no perder los datos del inventario cuando se cambia de sección y se regresa a la misma. Esto me estuvo pasando mucho y 
  //de hecho aquí fue el lugar donde empecé a usar signal, y me di cuenta de que era muy útil c:
  constructor (private productoService: ProductoService) {}
  ngOnInit(): void{
    this.productoService.obtenerProductos().subscribe({
      next: (datos) =>{
        this.productos.set(datos);
      },
      error:(error) =>{
        console.error('Error al cargar la base de datos', error);
      }
    });
  }
}