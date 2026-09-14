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