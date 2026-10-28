import { Component, OnInit, signal, computed } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Navbar } from '../../navbar/navbar';
import { ProveedorService } from '../../services/proveedor.service';
import { CompraService } from '../../services/compra.service';
import { ProductoService } from '../../services/producto.service';
import { Proveedor } from '../../models/proveedor.model';
import { Compra, CompraCompleta, RenglonCompra } from '../../models/compra.model';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-compras',
  imports: [Navbar, DatePipe, DecimalPipe],
  templateUrl: './compras.html',
  styleUrl: './compras.css'
})
export class Compras implements OnInit {
  seccion = signal<'compra' | 'distribuidores' | 'historial'>('compra');

  proveedores = signal<Proveedor[]>([]);
  compras = signal<Compra[]>([]);
  productos = signal<Producto[]>([]);

  // Datos de la compra que se está capturando
  proveedorId = signal<number>(0);
  fecha = signal<string>('');
  renglones = signal<RenglonCompra[]>([]);

  // El total se recalcula solo cuando cambian los renglones
  total = computed(() =>
    this.renglones().reduce((suma, r) => suma + r.subtotal, 0)
  );

  modal = signal<'proveedor' | 'detalle' | null>(null);
  editandoProveedor = signal(false);
  proveedorSeleccionado = signal<Proveedor | null>(null);
  detalleCompra = signal<CompraCompleta | null>(null);

  error = signal('');
  exito = signal('');

  constructor(
    private proveedorService: ProveedorService,
    private compraService: CompraService,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.cargarTodo();
  }

  cargarTodo(): void {
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

  //captura de la compra

  seleccionarProveedor(event: Event): void {
    this.proveedorId.set(Number((event.target as HTMLSelectElement).value));
  }

  seleccionarFecha(event: Event): void {
    this.fecha.set((event.target as HTMLInputElement).value);
  }

  agregarRenglon(event: Event): void {
    event.preventDefault();
    this.error.set('');

    const formulario = event.target as HTMLFormElement;
    const datos = new FormData(formulario);
    const productoId = Number(datos.get('producto'));
    const cantidad = Number(datos.get('cantidad'));
    const costoUnitario = Number(datos.get('costo'));

    if (!productoId) {
      this.error.set('Selecciona un producto');
      return;
    }
    if (cantidad < 1) {
      this.error.set('La cantidad debe ser al menos uno');
      return;
    }
    if (costoUnitario <= 0) {
      this.error.set('El costo debe ser mayor que cero');
      return;
    }

    const producto = this.productos().find(p => p.id === productoId);
    if (!producto) {
      return;
    }

    this.renglones.update(renglones => [
      ...renglones,
      {
        productoId: producto.id,
        nombreProducto: producto.nombre,
        cantidad,
        costoUnitario,
        subtotal: costoUnitario * cantidad
      }
    ]);

    //se limpia el formulario para capturar el siguiente renglón
    formulario.reset();
  }

  quitarRenglon(indice: number): void {
    this.renglones.update(renglones => renglones.filter((_, i) => i !== indice));
  }

  registrarCompra(): void {
    this.error.set('');
    this.exito.set('');

    if (!this.proveedorId()) {
      this.error.set('Selecciona un proveedor');
      return;
    }
    if (!this.fecha()) {
      this.error.set('Indica la fecha de la compra');
      return;
    }
    if (this.renglones().length === 0) {
      this.error.set('Agrega al menos un producto');
      return;
    }

    this.compraService
      .registrarCompra(this.proveedorId(), this.fecha(), this.renglones())
      .subscribe({
        next: () => {
          this.exito.set('Compra registrada correctamente');
          this.renglones.set([]);
          this.cargarTodo();
        },
        error: (error) => {
          this.error.set(error.error?.mensaje || 'No se pudo registrar la compra');
        }
      });
  }

  //proveedores

  abrirNuevoProveedor(): void {
    this.proveedorSeleccionado.set(null);
    this.editandoProveedor.set(false);
    this.error.set('');
    this.modal.set('proveedor');
  }

  abrirEditarProveedor(proveedor: Proveedor): void {
    this.proveedorSeleccionado.set(proveedor);
    this.editandoProveedor.set(true);
    this.error.set('');
    this.modal.set('proveedor');
  }

  guardarProveedor(event: Event): void {
    event.preventDefault();
    this.error.set('');

    const formulario = event.target as HTMLFormElement;
    const datos = new FormData(formulario);

    const proveedor = {
      nombre: datos.get('nombre') as string,
      telefono: datos.get('telefono') as string,
      correo: datos.get('correo') as string
    };

    if (!proveedor.nombre) {
      this.error.set('El nombre es obligatorio');
      return;
    }

    const peticion = this.editandoProveedor()
      ? this.proveedorService.modificarProveedor(this.proveedorSeleccionado()!.id, proveedor)
      : this.proveedorService.crearProveedor(proveedor);

    peticion.subscribe({
      next: () => {
        this.cargarTodo();
        this.cerrarModal();
      },
      error: (error) => {
        this.error.set(error.error?.mensaje || 'No se pudo guardar el proveedor');
      }
    });
  }

  darDeBajaProveedor(): void {
    const proveedor = this.proveedorSeleccionado();
    if (!proveedor) {
      return;
    }

    this.proveedorService.darDeBajaProveedor(proveedor.id).subscribe({
      next: () => {
        this.cargarTodo();
        this.cerrarModal();
      },
      error: (error) => {
        this.error.set(error.error?.mensaje || 'No se pudo dar de baja el proveedor');
      }
    });
  }

  //detalle de compra

  abrirDetalle(id: number): void {
    this.compraService.obtenerDetalle(id).subscribe({
      next: (datos) => {
        this.detalleCompra.set(datos);
        this.modal.set('detalle');
      },
      error: (error) => console.error('Error al cargar el detalle', error)
    });
  }

  cerrarModal(): void {
    this.modal.set(null);
    this.proveedorSeleccionado.set(null);
    this.detalleCompra.set(null);
    this.error.set('');
  }
}