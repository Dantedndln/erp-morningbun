import { Component, OnInit, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Navbar } from '../../navbar/navbar';
import { VentaService } from '../../services/venta.service';
import { ProductoService } from '../../services/producto.service';
import { CarritoService } from '../../services/carrito.service';
import { Venta, VentaCompleta } from '../../models/venta.model';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-ventas',
  imports: [Navbar, DatePipe, DecimalPipe],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css'
})
export class Ventas implements OnInit {
  seccion = signal<'venta' | 'historial'>('venta');
  productos = signal<Producto[]>([]);
  ventas = signal<Venta[]>([]);
  categoriaActiva = signal<string>('');

  modal = signal<'venta' | 'ticket' | 'detalle' | null>(null);
  detalleVenta = signal<VentaCompleta | null>(null);

  // Datos del ticket recién emitido
  ticketId = signal<number>(0);
  ticketTotal = signal<string>('');
  ticketCliente = signal<string>('');
  renglonesTicket = signal<{ nombre: string; cantidad: number; subtotal: number }[]>([]);

  error = signal('');

  constructor(
    private ventaService: VentaService,
    private productoService: ProductoService,
    public carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarVentas();
  }

  cargarProductos(categoria: string = ''): void {
    this.categoriaActiva.set(categoria);

    this.productoService.obtenerProductos(categoria).subscribe({
      next: (datos) => this.productos.set(datos),
      error: (error) => console.error('Error al cargar los productos', error)
    });
  }

  cargarVentas(): void {
    this.ventaService.obtenerVentas().subscribe({
      next: (datos) => this.ventas.set(datos),
      error: (error) => console.error('Error al cargar las ventas', error)
    });
  }

  agregar(producto: Producto): void {
    if (producto.stock < 1) { return; }
    this.carritoService.agregar(producto);
  }

  abrirVenta(): void {
    this.error.set('');
    this.modal.set('venta');
  }

  cerrarModal(): void {
    this.modal.set(null);
    this.detalleVenta.set(null);
    this.error.set('');
  }

  // Registra la venta de mostrador y emite el ticket
  confirmarVenta(event: Event): void {
    event.preventDefault();
    this.error.set('');

    const formulario = event.target as HTMLFormElement;
    const datos = new FormData(formulario);

    const clienteNombre = (datos.get('cliente') as string) || '';
    const correoCliente = (datos.get('correo') as string) || '';

    if (!clienteNombre.trim()) {
      this.error.set('Captura el nombre del cliente');
      return;
    }
    if (this.carritoService.items().length === 0) {
      this.error.set('Agrega productos a la venta');
      return;
    }

    this.ventaService
      .registrarVenta(clienteNombre, correoCliente, this.carritoService.paraBackend())
      .subscribe({
        next: (respuesta) => {
          // Se conservan los renglones antes de vaciar el carrito
          this.renglonesTicket.set(
            this.carritoService.items().map(i => ({
              nombre: i.producto.nombre,
              cantidad: i.cantidad,
              subtotal: this.carritoService.subtotal(i)
            }))
          );

          this.ticketId.set(respuesta.ventaId);
          this.ticketTotal.set(respuesta.total);
          this.ticketCliente.set(clienteNombre);

          this.carritoService.vaciar();
          this.modal.set('ticket');

          this.cargarProductos(this.categoriaActiva());
          this.cargarVentas();
        },
        error: (error) => {
          this.error.set(error.error?.mensaje || 'No se pudo registrar la venta');
        }
      });
  }

  abrirDetalle(id: number): void {
    this.ventaService.obtenerDetalle(id).subscribe({
      next: (datos) => {
        this.detalleVenta.set(datos);
        this.modal.set('detalle');
      },
      error: (error) => console.error('Error al cargar el detalle', error)
    });
  }

  
}