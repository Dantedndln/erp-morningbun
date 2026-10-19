import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Navbar } from '../../navbar/navbar';
import { VentaService } from '../../services/venta.service';
import { ProductoService } from '../../services/producto.service';
import { Venta } from '../../models/venta.model';
import { Producto } from '../../models/producto.model';
import {TitleCasePipe} from "@angular/common";
@Component({
  imports: [Navbar, DatePipe, TitleCasePipe],
  selector: 'app-ventas',
  styleUrl: './ventas.css',
  templateUrl: './ventas.html',
})
export class Ventas implements OnInit {

  // controla cuál de las dos secciones se muestra
  seccion = signal<'venta' | 'historial'>('venta');

  // datos que llegan del backend
  ventas = signal<Venta[]>([]);
  productos = signal<Producto[]>([]);

  // se inyectan los dos servicios: uno para el historial, otro para el catálogo
  constructor(
    private ventaService: VentaService,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    // el catálogo de la sección "Registrar venta" reutiliza los mismos
    // productos del módulo de inventario, por eso se usa ProductoService
    this.productoService.obtenerProductos().subscribe({
      next: (datos) => this.productos.set(datos),
      error: (error) => console.error('Error al cargar los productos', error)
    });

    this.ventaService.obtenerVentas().subscribe({
      next: (datos) => this.ventas.set(datos),
      error: (error) => console.error('Error al cargar las ventas', error)
    });
  }
}
