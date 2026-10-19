import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Navbar } from '../../navbar/navbar';
import { ProveedorService } from '../../services/proveedor.service';
import { CompraService } from '../../services/compra.service';
import { ProductoService } from '../../services/producto.service';
import { Proveedor } from '../../models/proveedor.model';
import { Compra } from '../../models/compra.model';
import { Producto } from '../../models/producto.model';

@Component({
  imports: [Navbar, DatePipe],
  selector: 'app-compras',
  styleUrl: './compras.css',
  templateUrl: './compras.html',
})
export class Compras implements OnInit{
  //signal se usa para poder conservar los elementos de las secciones aunque se cambie de sección, y para poder reaccionar a los cambios de datos que llegan del backend
  proveedores = signal <Proveedor[]>([]);
  compras = signal <Compra[]>([]);
  productos = signal <Producto[]>([]);
  seccion = signal<'compra' | 'distribuidores' | 'historial'>('compra');
  // se inyectan los tres servicios: uno para los proveedores, otro para las compras y otro para los productos
  constructor(
    private proveedorService: ProveedorService,
    private compraService: CompraService,
    private productoService: ProductoService
  ){}

  ngOnInit(): void{
    this.proveedorService.obtenerProveedores().subscribe({
      next: (datos) => this.proveedores.set(datos),
      error: (error) => console.error('Error al cargar los proveedores', error)
    });

    this.compraService.obtenerCompras().subscribe({
      next: (datos) => this.compras.set(datos),
      error: (error) => console.error('Error al cargar las compras', error)
    });

    this.productoService.obtenerProductos().subscribe({
      next: (datos) => this.productos.set(datos),
      error: (error) => console.error('Error al cargar los productos', error)
    });
  }

}
